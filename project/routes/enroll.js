const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Lecture = require('../models/Lecture');


/**
 * 📌 수강 신청 API
 * POST /enroll/:lectureId
 */
router.post('/:lectureId', async (req, res) => {
  const lectureId = parseInt(req.params.lectureId);
  const studentId = req.body.studentId;

  // ✅ studentId 유효성 검사
  if (!studentId || isNaN(studentId)) {
    return res.status(400).json({ error: 'studentId가 유효하지 않습니다.' });
  }

  try {
    const lectureToAdd = await Lecture.findByPk(lectureId);
    if (!lectureToAdd) return res.status(404).json({ error: '강의 없음' });

    const existing = await Enrollment.findAll({
      where: { studentId },
      include: Lecture
    });

    // 중복 수강 방지
    const duplicate = await Enrollment.findOne({ where: { studentId, lecture_id: lectureId } });
    if (duplicate) {
      return res.status(400).json({ error: '이미 신청한 강의입니다.' });
    }

    // 시간 중복 검사
    const isConflict = existing.some(enr => {
      const lec = enr.Lecture;
      return lec.scheduleDay === lectureToAdd.scheduleDay &&
             lec.scheduleTimes.some(time => lectureToAdd.scheduleTimes.includes(time));
    });

    if (isConflict) {
      return res.status(400).json({ error: '시간이 겹치는 강의입니다.' });
    }

    await Enrollment.create({
      studentId,
      lecture_id: lectureId,
      course_id: lectureToAdd.course_id,
      sec_id: lectureToAdd.sec_id,
      semester: lectureToAdd.semester,
      year: lectureToAdd.year,
      grade: null
    });

    res.status(201).json({ message: '수강신청 완료' });
  } catch (err) {
    console.error('❌ 수강신청 오류:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 수강 신청 목록 조회
 * GET /enroll/enrollments/:studentId
 */
router.get('/enrollments/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);

  if (!studentId || isNaN(studentId)) {
    return res.status(400).json({ error: '유효한 studentId가 필요합니다.' });
  }

  try {
    const list = await Enrollment.findAll({
      where: { studentId },
      include: Lecture
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 수강 포기
 * DELETE /enroll/:lectureId
 */
router.delete('/:lectureId', async (req, res) => {
  const lectureId = parseInt(req.params.lectureId);
  const studentId = req.body.studentId;

  if (!studentId || isNaN(studentId)) {
    return res.status(400).json({ error: 'studentId가 유효하지 않습니다.' });
  }

  try {
    const deleted = await Enrollment.destroy({
       where: { studentId, lecture_id: lectureId }
    });

    if (deleted) {
      res.json({ message: '수강 포기 완료' });
    } else {
      res.status(404).json({ error: '수강 신청 내역 없음' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
