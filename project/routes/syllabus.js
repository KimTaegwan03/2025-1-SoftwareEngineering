const express = require('express');
const router = express.Router();
const Syllabus = require('../models/Syllabus');
const Lecture = require('../models/Lecture');

// 관계 설정
Syllabus.belongsTo(Lecture, { foreignKey: 'lecture_id' });

router.get('/:lectureId', async (req, res) => {
  const lectureId = parseInt(req.params.lectureId);

  try {
    const syllabus = await Syllabus.findOne({
      where: { lecture_id: lectureId },
      include: {
        model: Lecture
      }
    });

    if (!syllabus) return res.status(404).json({ error: '강의계획서 없음' });

    // Lecture 정보와 content를 함께 반환
    res.json({
      ...syllabus.Lecture?.dataValues,
      content: syllabus.content
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
