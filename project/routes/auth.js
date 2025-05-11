const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');

// POST /auth/student/register
router.post('/student/register', async (req, res) => {
    const { name, dept_name, tot_cred, acc_id, password } = req.body;
    try {
      const student = await Student.create({
        name,
        dept_name,
        tot_cred,
        acc_id,
        password,
      });
      res.status(201).json({ message: '학생 회원가입 성공', studentId: student.ID });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '학생 회원가입 실패', error: err.message });
    }
  });

  // POST /auth/instructor/register
router.post('/instructor/register', async (req, res) => {
    const { name, dept_name, acc_id, password } = req.body;
    try {
      const instructor = await Instructor.create({
        name,
        dept_name,
        acc_id,
        password,
      });
      res.status(201).json({ message: '교수 회원가입 성공', instructorId: instructor.ID });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '교수 회원가입 실패', error: err.message });
    }
  });

// POST /auth/student/login
router.post('/student/login', async (req, res) => {
    const { acc_id, password } = req.body;
  
    try {
      const student = await Student.findOne({ where: { acc_id } });
  
      if (!student || student.password !== password) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다' });
      }
  
      // 세션에 로그인 정보 저장
      req.session.student = {
        id: student.ID,
        name: student.name,
        dept_name: student.dept_name,
      };
  
      res.json({ message: '로그인 성공', student: req.session.student });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '로그인 실패' });
    }
  });

// POST /auth/instructor/login
router.post('/instructor/login', async (req, res) => {
    const { acc_id, password } = req.body;
  
    try {
      const instructor = await Instructor.findOne({ where: { acc_id } });
  
      if (!instructor || instructor.password !== password) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다' });
      }
  
      // 세션에 로그인 정보 저장
      req.session.instructor = {
        id: instructor.ID,
        name: instructor.name,
        dept_name: instructor.dept_name,
      };
  
      res.json({ message: '로그인 성공', instructor: req.session.instructor });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '로그인 실패' });
    }
  });

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: '로그아웃 완료' });
    });
  });

// GET /auth/session
router.get('/session', (req, res) => {
    if (req.session.student) {
      res.json({ loggedIn: true, isStudent: true, student: req.session.student });
    } else if (req.session.instructor) {
      res.json({ loggedIn: true, isStudent: false, instructor: req.session.instructor });
    } else {
      res.json({ loggedIn: false });
    }
  });

module.exports = router;