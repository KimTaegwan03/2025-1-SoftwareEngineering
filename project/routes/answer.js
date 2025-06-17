var express = require('express');
var router = express.Router();
const Answer = require('../models/Answer');
const { Op } = require('sequelize');

/* 질문에 대한 답글 10개 get */
router.get('/', async (req, res, next) => {
	console.log('✅ answer GET route hit'); // 로그 추가
	const question_id = parseInt(req.query.question_id) || 0; // lecture_id가 0인 강의는 없음
	try {
		const answers = await Answer.findAll({
			where: { question_id: question_id },
			order: [['createdAt', 'ASC']],        // 최신순
		});
		res.json(answers);
	} catch (err) {
		console.log(err);
		next(err); // 에러 핸들링을 위해 next 호출
	}
});

/* 질문에 대한 답글 post */
router.post('/write', async (req, res, next) => {
	console.log('✅ answer POST route hit'); // 로그 추가
	const { content } = req.body;
	const question_id = parseInt(req.query.question_id) || 0; // question_id 0인 질문은 없음
	const writer_id = req.session.instructor.id;
	try {
		const newAnswer = await Answer.create({
			question_id: question_id,
			writer_id: writer_id,
			content: content,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		res.status(201).json(newAnswer);
	} catch (err) {
		console.error('DB insert 실패:', err);
		res.status(500).json({ error: '공지사항 등록 실패' });
	}
});

module.exports = router;