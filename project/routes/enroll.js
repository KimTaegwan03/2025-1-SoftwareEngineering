const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Lecture = require('../models/Lecture');

Enrollment.belongsTo(Lecture, { foreignKey: 'lectureId' });

// POST /enroll/:lectureId
router.post('/:lectureId', async (req, res) => {
  const lectureId = parseInt(req.params.lectureId);
  const studentId = 1; // 나중에 로그인 시스템 도입 시 대체

  try {
    const lectureToAdd = await Lecture.findByPk(lectureId);
    if (!lectureToAdd) return res.status(404).json({ error: '강의 없음' });

    const existing = await Enrollment.findAll({
      where: { studentId },
      include: Lecture
    });

    // 시간 겹침 체크
    const isConflict = existing.some(enr => {
      const lec = enr.Lecture;
      return lec.scheduleDay === lectureToAdd.scheduleDay &&
             lec.scheduleTimes.some(time => lectureToAdd.scheduleTimes.includes(time));
    });

    if (isConflict) {
      return res.status(400).json({ error: '시간이 겹치는 강의입니다.' });
    }

    // 중복 신청 방지
    const duplicate = await Enrollment.findOne({ where: { studentId, lectureId } });
    if (duplicate) {
      return res.status(400).json({ error: '이미 신청한 강의입니다.' });
    }

    await Enrollment.create({ studentId, lectureId });
    res.status(201).json({ message: '수강신청 완료' });

  } catch (err) {
    console.error('❌ 수강신청 오류:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/enrollments/:studentId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);

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

router.delete('/:lectureId', async (req, res) => {
  const studentId = 1; // 고정값 또는 세션에서 추출
  const lectureId = parseInt(req.params.lectureId);

  try {
    const deleted = await Enrollment.destroy({
      where: { studentId, lectureId }
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
