const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');
const Student = require('../models/Student');
const Syllabus = require('../models/Syllabus');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
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
      syllabusContent,
      instructor_id  
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
      professor,
      credit,
      semester,
      year,
      building,
      room_number,
      professor,
      scheduleDay: day,
      scheduleTimes,
      maxSeats,
      instructor_id
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

router.get('/attendance/:lectureId', async (req, res) => {
  const { lectureId } = req.params;
  let { date } = req.query;

  // 날짜 기본값: 오늘
  if (!date) {
    const today = new Date();
    date = today.toISOString().slice(0, 10);
  }

  try {
    // 1. 출석 정보 조회
    const attendanceRecords = await Attendance.findAll({
      where: {
        lecture_id: lectureId,
        date: date
      }
      , include: [{
        model: Student,
        attributes: ['name']
      }]
    });

    if (attendanceRecords.length > 0) {
      // ✅ 출석 정보가 있으면 반환
      const formatted = attendanceRecords.map(r => ({
        studentId: r.student_id,
        name: r.Student.name,
        status: r.status
      }));
      return res.json(formatted);
    }

    // 2. 출석 정보 없으면 → 학생 목록 반환
    const enrollments = await Enrollment.findAll({
      where: { lecture_id: lectureId },
      include: [Student]
    });

    const students = enrollments.map(e => ({
      studentId: e.studentId,
      name: e.Student.name
    }));

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '출석 조회 실패', error: err.message });
  }
});


// router.get('/attendance/:lectureId', async (req, res) => {
//   const { lectureId } = req.params;
//   const enrollments = await Enrollment.findAll({
//     where: { lecture_id: lectureId },
//     include: [Student]
//   });

//   const students = enrollments.map(e => ({
//     studentId: e.studentId,
//     name: e.Student.name
//   }));

//   res.json(students);
// });

router.post('/attendance/:lectureId', async (req, res) => {
  const { lectureId } = req.params;
  const { date, attendance } = req.body;
  // attendance: [{ studentId: 1, status: '출석' }, ...]

  const values = attendance.map(item => ({
    lecture_id: lectureId,
    student_id: item.studentId,
    date,
    status: item.status
  }));

  try {
    for (const record of values) {
      await Attendance.upsert(record); // 있으면 업데이트, 없으면 삽입
    }
    res.json({ message: '출석 저장 완료' });
  } catch (err) {
    res.status(500).json({ message: '출석 저장 실패', error: err });
  }
});


module.exports = router;
