var express = require('express');
var router = express.Router();
const Notice = require('../models/Notice')
const { Op } = require('sequelize');

/* 공지사항 10개 get */
router.get('/notice', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const notices = await Notice.findAll({
      where: {
        id: {
          [Op.between]: [page * 10 - 9, page * 10]  // 10 이상 20 이하
        }
      },
      order: [['id', 'DESC']]
    });
    res.json(notices);
  } catch (err) {
    console.log(err);
    next(err); // 에러 핸들링을 위해 next 호출
  }
});

/* id가 id인 공지사항 get */
router.get('/notice/:id', async (req, res, next) => {
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

module.exports = router;
