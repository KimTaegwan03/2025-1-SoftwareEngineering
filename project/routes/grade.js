const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Lecture = require('../models/Lecture');
const Department = require('../models/Department');

router.get('/lecture/:lectureId', async (req, res) => {
  const { lectureId } = req.params;
  const enrollments = await Enrollment.findAll({
    where: { lecture_id: lectureId },
    include: [Student]
  });

  const grades = enrollments.map(e => ({
    studentId: e.studentId,
    name: e.Student.name,
    grade: e.grade
  }));

  res.json(grades);
});

router.post('/lecture/:lectureId', async (req, res) => {
  const { lectureId } = req.params;
  const { grades } = req.body; // [{ studentId, grade }, ...]

  for (const g of grades) {
    await Enrollment.update(
      { grade: g.grade },
      { where: { lecture_id: lectureId, studentId: g.studentId } }
    );
  }

  res.json({ message: '성적 저장 완료' });
});

router.get('/student', async (req, res) => {
    if (!req.session.student) {
    return res.status(401).json({ message: '로그인이 필요합니다' });
  }

  const studentId = req.session.student.id;

  const enrollments = await Enrollment.findAll({
    where: { studentId },
    include: [Lecture]
  });

  const grades = enrollments.map(e => ({
    lectureTitle: e.Lecture.title,
    courseId: e.Lecture.course_id,
    semester: e.Lecture.semester,
    year: e.Lecture.year,
    grade: e.grade,
    credit: e.Lecture.credit
  }));

  res.json(grades);
});

// GET grade/gradCreds
router.get('/gradCreds', async (req, res) => {
  if (!req.session.student) {
    return res.status(401).json({ message: '로그인이 필요합니다' });
  }

  const studentId = req.session.student.id;

  // 학생이 소속된 학과의 졸업학점 기준을 가져옴
  const department = await Department.findOne({
    where: { dept_name: req.session.student.dept_name },
    attributes: ['gradCreds']
  });

  // 학생의 수강과목 중 D 이상인 학점만 계산
  const enrollments = await Enrollment.findAll({
    where: { studentId },
    attributes: ['grade'],
    include: [Lecture]
  });

  sum = 0;
  // 수강한 과목의 학점 합산 (A+ ~ D까지)
  enrollments.forEach(e => {
    if (['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D'].includes(e.grade)) {
      sum += e.Lecture.credit;
    }
  });

  res.json({ totalCredits: sum, gradCreds: department.gradCreds });
});

module.exports = router;