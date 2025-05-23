const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Lecture = require('../models/Lecture');

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
    grade: e.grade
  }));

  res.json(grades);
});

module.exports = router;