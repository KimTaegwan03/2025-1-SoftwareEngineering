// backend/routes/reviews.js
const express = require('express');
const router = express.Router();
const { Review, Lecture, Student, Enrollment } = require('../models');

// 특정 강의의 리뷰 목록 조회
router.get('/:lectureId', async (req, res) => {
  try {
    const lectureId = +req.params.lectureId;
    const reviews = await Review.findAll({
      where: { lecture_id: lectureId },
      include: [{
        model: Student,
        attributes: ['name']
      }]
    });
    res.json(reviews.map(r => ({
      id: r.id,
      studentName: r.Student.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 특정 강의에 리뷰 등록
router.post('/:lectureId', async (req, res) => {
  try {
    const lectureId = +req.params.lectureId;
    const studentId = req.session.student.id;   // 로그인된 학생 ID

    // 1) 수강 신청 확인
    const enrolled = await Enrollment.findOne({
      where: { lecture_id: lectureId, studentId }
    });
    if (!enrolled) {
      return res
        .status(403)
        .json({ error: '수강 신청하지 않은 강의에는 리뷰를 작성할 수 없습니다.' });
    }
      //  이미 리뷰를 쓴 적이 있는지 체크
    const existing = await Review.findOne({
      where: { lecture_id: lectureId, student_id: studentId }
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: '이미 이 강의에 대한 리뷰를 작성하셨습니다.' });
    }

    // 2) 리뷰 생성
    const { rating, comment } = req.body;
    const newReview = await Review.create({
      lecture_id: lectureId,
      student_id: studentId,
      rating,
      comment
    });
    res.status(201).json(newReview);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
