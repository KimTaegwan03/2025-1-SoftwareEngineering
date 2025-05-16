const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');
const Syllabus = require('../models/Syllabus');
Lecture.hasOne(Syllabus, { foreignKey: 'lectureId' });

// ✅ 강의 등록 API
router.post('/register', async (req, res) => {
  try {
    const {
      course_id,
      sec_id,
      title,
      dept_name,
      credit,
      semester,
      year,
      building,
      room_number,
      professor,
      day,
      startTime,
      endTime,
      maxSeats,
      syllabusContent
    } = req.body;

    // ✅ 교시 배열 생성
    const start = Number(startTime);
    const end = Number(endTime);
    const scheduleTimes = [];
    for (let i = start; i <= end; i++) scheduleTimes.push(i);

    const lecture = await Lecture.create({
      course_id,
      sec_id,
      title,
      dept_name,
      credit,
      semester,
      year,
      building,
      room_number,
      professor,
      scheduleDay: day,
      scheduleTimes,
      maxSeats
    });

    await Syllabus.create({
      lectureId: lecture.id,
      content: syllabusContent
    });

    res.status(201).json({ message: '강의 및 계획서 등록 완료', lecture });
  } catch (err) {
    console.error('❌ 등록 실패:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 강의 목록 조회 API
router.get('/list', async (req, res) => {
  try {
    const lectures = await Lecture.findAll({
      include: {
        model: Syllabus,
        attributes: ['content']
      }
    });
    res.json(lectures);
  } catch (err) {
    console.error('❌ 강의 목록 조회 실패:', err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
