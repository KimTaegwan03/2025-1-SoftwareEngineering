const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/mypage', (req, res) => {
  if (!req.session.student) {
    return res.status(401).json({ message: '로그인이 필요합니다' });
  }

  const student = req.session.student;

  res.json({
    id: student.ID,
    name: student.name,
    dept_name: student.dept_name,
    tot_cred: student.tot_cred,
    acc_id: student.acc_id,
    email: student.email,
    phone: student.phone,
    address: student.address
  });
});
