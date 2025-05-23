const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');

router.get('/instructor', async (req, res) => {
  if (!req.session.instructor) {
    return res.status(401).json({ message: '로그인이 필요합니다' });
  }

  const instructorId = req.session.instructor.id;

  const lectures = await Lecture.findAll({
    where: { instructor_id: instructorId }
  });

  res.json(lectures);
});

module.exports = router;