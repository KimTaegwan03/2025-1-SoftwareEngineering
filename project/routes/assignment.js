var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Assignment = require('../models/Assignment');
const AssignmentSubmit = require('../models/AssignmentSubmit');
const { Op } = require('sequelize');


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(__dirname, '../public/image/assignment');

		// 폴더가 없으면 생성
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true }); // 중첩 폴더까지 생성
		}

		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		file.originalname = Buffer.from(file.originalname, "latin1").toString(
			"utf-8"
		);
		const uniqueName = Date.now() + '-' + file.originalname;
		cb(null, uniqueName);
	}
});
const upload = multer({ storage });

/* 과제 전부 get */
router.get('/', async (req, res, next) => {
	const lecture_id = parseInt(req.query.lecture_id) || 0; // lecture_id가 0인 강의는 없음
	const page = parseInt(req.query.page) || 1;
	try {
		const assignments = await Assignment.findAll({
			where: { lecture_id: lecture_id },
			order: [['createdAt', 'DESC']],        // 최신순
		});
		res.json(assignments);
	} catch (err) {
		console.log(err);
		next(err); // 에러 핸들링을 위해 next 호출
	}
});

/* id가 id인 과제 get */
router.get('/:id', async (req, res, next) => {
	try {
		const assignments = await Assignment.findByPk(req.params.id);
		if (!assignments) {
			return res.status(404).json({ error: 'Not found' });
		}
		res.json(assignments);
	} catch (err) {
		next(err);
	}
});

/* 과제 post */
router.post('/write', upload.single('file'), async (req, res) => {
	const { lecture_id, title, content, start_dt, end_dt } = req.body;
	const imagePath = req.file ? `image/assignment/${req.file.filename}` : null;
	try {
		const newAssignment = await Assignment.create({
			lecture_id: lecture_id,
			title: title,
			content: content,
			file_url: imagePath,
			start_dt: start_dt,
			end_dt: end_dt,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		res.status(201).json(newAssignment);
	} catch (err) {
		console.error('DB insert 실패:', err);
		res.status(500).json({ error: '공지사항 등록 실패' });
	}
});

/* id가 id인 과제 delete */
router.delete('/delete/:id', async (req, res, next) => {
	try {
		const deletedCount = await Assignment.destroy({
			where: { id: req.params.id }
		});

		if (deletedCount === 0) {
			return res.status(404).json({ error: '해당 공지를 찾을 수 없습니다.' });
		}

		res.json({ message: '공지사항이 성공적으로 삭제되었습니다.' });
	} catch (err) {
		next(err);
	}
});

/* 특정 과제의 모든 제출 get */
router.get('/submit/all/:assignment_id', async (req, res) => {
	const assignment_id = req.params.assignment_id;
	try {
		const submit = await AssignmentSubmit.findAll({
			where: {
				assignment_id: assignment_id,
			}
		});
		res.status(201).json(submit);
	} catch (err) {
		console.error('DB insert 실패:', err);
		res.status(500).json({ error: '공지사항 등록 실패' });
	}
});

/* 특정 학생의 특정 과제 제출 get */
router.get('/submit/:assignment_id', async (req, res) => {
	const assignment_id = req.params.assignment_id;
	const student_id = req.session.student.id;
	try {
		const submit = await AssignmentSubmit.findOne({
			where: {
				assignment_id: assignment_id,
				student_id: student_id
			}
		});
		res.status(201).json(submit);
	} catch (err) {
		console.error('DB insert 실패:', err);
		res.status(500).json({ error: '공지사항 등록 실패' });
	}
});

/* 과제 제출 post */
router.post('/submit', upload.single('file'), async (req, res) => {
	const { assignment_id, title, content } = req.body;
	const imagePath = req.file ? `image/assignment/${req.file.filename}` : null;
	const student_id = req.session.student.id;

	try {
		const [submission, created] = await AssignmentSubmit.findOrCreate({
			where: { assignment_id, student_id },
			defaults: {
				title,
				content,
				file_url: imagePath,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});

		if (!created) {
			// 기존 제출물이 있으면 수정
			submission.title = title;
			submission.content = content;
			if (imagePath) submission.file_url = imagePath; // 새 파일이 있으면 갱신
			submission.updatedAt = new Date();
			await submission.save();
		}

		res.status(201).json(submission);
	} catch (err) {
		console.error('제출 처리 실패:', err);
		res.status(500).json({ error: '과제 제출 실패' });
	}
});

module.exports = router;