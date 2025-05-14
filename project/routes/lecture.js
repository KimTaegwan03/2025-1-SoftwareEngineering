const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');
const Syllabus = require('../models/Syllabus');

// 강의 등록 API
router.post('/register', async (req, res) => {
  try {
    const { title, professor, credit, schedule, syllabusContent } = req.body; // ✅ 여기에 syllabusContent 추가

    const lecture = await Lecture.create({ title, professor, credit, schedule });
    console.log('✅ 등록된 lecture:', lecture);

    const syllabus = await Syllabus.create({
      lectureId: lecture.id,
      content: syllabusContent
    });
    console.log('✅ 등록된 syllabus:', syllabus);

    res.status(201).json({ message: '강의 및 계획서 등록 완료', lecture });
  } catch (err) {
    console.error('❌ 등록 중 오류 발생:', err); // ✅ 이 로그도 절대 빼면 안 됨
    res.status(500).json({ error: err.message });
  }
});


// 강의 목록 조회
router.get('/list', async (req, res) => {
  try {
    const lectures = await Lecture.findAll();
    res.json(lectures);
  } catch (err) {
     console.error('❌ 등록 중 오류 발생:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
