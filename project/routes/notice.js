var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const Notice = require('../models/Notice')
const { Op } = require('sequelize');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/image/notice')); // 실제 경로
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/* 공지사항 10개 get */
router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const notices = await Notice.findAll({
      order: [['createdAt', 'DESC']],        // 최신순
      limit: 10,                      // 한 페이지당 10개
      offset: (page - 1) * 10         // 건너뛸 개수
    });
    res.json(notices);
  } catch (err) {
    console.log(err);
    next(err); // 에러 핸들링을 위해 next 호출
  }
});

/* id가 id인 공지사항 get */
router.get('/:id', async (req, res, next) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(notice);
  } catch (err) {
    next(err);
  }
});

/* 공지사항 post */
router.post('/write', upload.single('image'), async (req, res) => {
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
  const { writer, title, content } = req.body;
  const imagePath = req.file ? `/image/notice/${req.file.filename}` : null;

  try {
    const newNotice = await Notice.create({
      writer: writer,
      title: title,
      content: content,
      image_url: imagePath,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json(newNotice);
  } catch (err) {
    console.error('DB insert 실패:', err);
    res.status(500).json({ error: '공지사항 등록 실패' });
  }
});

module.exports = router;

module.exports = router;
