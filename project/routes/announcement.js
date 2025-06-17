var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Announcement = require('../models/Announcement')
const { Op } = require('sequelize');


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(__dirname, '../public/image/announcement');

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

/* 공지사항 전부 get */
router.get('/', async (req, res, next) => {
	const lecture_id = parseInt(req.query.lecture_id) || 0; // lecture_id가 0인 강의는 없음
	try {
		const announcements = await Announcement.findAll({
			where: { lecture_id: lecture_id },
			order: [['updatedAt', 'DESC']],        // 최신순
		});
		res.json(announcements);
	} catch (err) {
		console.log(err);
		next(err); // 에러 핸들링을 위해 next 호출
	}
});

/* id가 id인 공지사항 get */
router.get('/:id', async (req, res, next) => {
	try {
		const announcement = await Announcement.findByPk(req.params.id);
		if (!announcement) {
			return res.status(404).json({ error: 'Not found' });
		}
		res.json(announcement);
	} catch (err) {
		next(err);
	}
});

/* 공지사항 post */
router.post('/write', upload.single('file'), async (req, res) => {
	const { lecture_id, title, content } = req.body;
	const imagePath = req.file ? `image/announcement/${req.file.filename}` : null;
	try {
		const newAnnouncement = await Announcement.create({
			lecture_id: lecture_id,
			title: title,
			content: content,
			file_url: imagePath,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		res.status(201).json(newAnnouncement);
	} catch (err) {
		console.error('DB insert 실패:', err);
		res.status(500).json({ error: '공지사항 등록 실패' });
	}
});

/* id가 id인 공지사항 delete */
router.delete('/delete/:id', async (req, res, next) => {
	try {
		const deletedCount = await Announcement.destroy({
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