const express = require('express');
const router = express.Router();
const Syllabus = require('../models/Syllabus');
const Lecture = require('../models/Lecture');

// 강의 계획서 조회
router.get('/:lectureId', async (req, res) => {
  try {
    const syllabus = await Syllabus.findOne({
      where: { lectureId: req.params.lectureId },
      include: { model: Lecture }
    });

    if (!syllabus) return res.status(404).json({ error: '강의 계획서 없음' });

    res.json({
      content: syllabus.content,
      professor: syllabus.Lecture.professor,
      lectureTitle: syllabus.Lecture.title
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
