const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Lecture = require('../models/Lecture');

// 관계 설정
Enrollment.belongsTo(Lecture, { foreignKey: 'lectureId' });

/**
 * 📌 수강 신청 API
 * POST /enroll/:lectureId
 */
router.post('/:lectureId', async (req, res) => {
  const lectureId = parseInt(req.params.lectureId);
  const studentId = 1; // 추후 세션/토큰에서 추출

  try {
    const lectureToAdd = await Lecture.findByPk(lectureId);
    if (!lectureToAdd) return res.status(404).json({ error: '강의 없음' });

    // 수강 내역 불러오기 (시간표 중복 검사용)
    const existing = await Enrollment.findAll({
      where: { studentId },
      include: Lecture
    });

    // 시간 중복 검사
    const isConflict = existing.some(enr => {
      const lec = enr.Lecture;
      return lec.scheduleDay === lectureToAdd.scheduleDay &&
             lec.scheduleTimes.some(time => lectureToAdd.scheduleTimes.includes(time));
    });

    if (isConflict) {
      return res.status(400).json({ error: '시간이 겹치는 강의입니다.' });
    }

    // 중복 수강 방지
    const duplicate = await Enrollment.findOne({ where: { studentId, lectureId } });
    if (duplicate) {
      return res.status(400).json({ error: '이미 신청한 강의입니다.' });
    }

    // 수강 신청 (추가 정보 포함)
    await Enrollment.create({
      studentId,
      lectureId,
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
  const studentId = 1; // 고정값 or 로그인 시스템 적용 예정
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

/**
 * (선택) 📌 분반 코드 기반 삭제도 가능
 * DELETE /enroll/drop/:course_id/:sec_id
 */
// router.delete('/drop/:course_id/:sec_id', async (req, res) => {
//   const studentId = 1;
//   const { course_id, sec_id } = req.params;

//   try {
//     const deleted = await Enrollment.destroy({
//       where: { studentId, course_id, sec_id }
//     });

//     if (deleted) {
//       res.json({ message: '수강 포기 완료' });
//     } else {
//       res.status(404).json({ error: '신청 내역 없음' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
