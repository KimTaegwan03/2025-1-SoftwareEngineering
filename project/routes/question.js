var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');
const { Op } = require('sequelize');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(__dirname, '../public/image/question');

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

/* 질문 10개 get */
router.get('/', async (req, res, next) => {
	const lecture_id = parseInt(req.query.lecture_id) || 0; // lecture_id가 0인 강의는 없음
	const page = parseInt(req.query.page) || 1;
	try {
		const questions = await Question.findAll({
			where: { lecture_id: lecture_id },
			order: [['createdAt', 'DESC']],        // 최신순
			limit: 10,                      // 한 페이지당 10개
			offset: (page - 1) * 10         // 건너뛸 개수
		});
		res.json(questions);
	} catch (err) {
		console.log(err);
		next(err); // 에러 핸들링을 위해 next 호출
	}
});

/* id가 id인 질문 get */
router.get('/:id', async (req, res, next) => {
	try {
		const question = await Question.findByPk(req.params.id);
		if (!question) {
			return res.status(404).json({ error: 'Not found' });
		}
		res.json(question);
	} catch (err) {
		next(err);
	}
});

/* 질문 post */
router.post('/write', upload.single('file'), async (req, res) => {
	const { lecture_id, title, content } = req.body;
	const imagePath = req.file ? `image/question/${req.file.filename}` : null;
	const writer_id = req.session.student.id;
	try {
		const newQuestion = await Question.create({
			lecture_id: lecture_id,
			writer_id: writer_id,
			title: title,
			content: content,
			file_url: imagePath,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		res.status(201).json(newQuestion);
	} catch (err) {
		console.error('DB insert 실패:', err);
		res.status(500).json({ error: '공지사항 등록 실패' });
	}
});

/* id가 id인 질문 delete */
router.delete('/delete/:id', async (req, res, next) => {
	try {
		const deletedCount = await Question.destroy({
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

module.exports = router;