// routes/stat.js
const express = require('express');
const router = express.Router();
const { Enrollment, Student, Lecture } = require('../models');  // index.js에서 연관관계 정의된 모델들

/**
 * @route   GET /stats/lecture/:lectureId/breakdown
 * @desc    해당 강의의 학과별 수강 인원 통계
 * @access  교수 또는 관리자
 */
router.get('/lecture/:lectureId/breakdown', async (req, res) => {
  try {
    const lectureId = parseInt(req.params.lectureId, 10);
    if (isNaN(lectureId)) {
      return res.status(400).json({ error: '유효한 강의 ID가 아닙니다.' });
    }

    // (선택) lectureId가 실제로 존재하는지 확인
    const lecture = await Lecture.findByPk(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: '강의를 찾을 수 없습니다.' });
    }

    // 1) 학과별 집계: Enrollment → Student 조인 후 Student.dept_name 기준 GROUP BY
    const deptCounts = await Enrollment.findAll({
      where: { lecture_id: lectureId },
      attributes: [
        [Student.sequelize.col('dept_name'), 'dept_name'],
        [Enrollment.sequelize.fn('COUNT', '*'), 'count']
      ],
      include: [
        {
          model: Student,
          attributes: []  // 실제 Select에는 dept_name만 필요하므로 빈 배열로 둠
        }
      ],
      group: ['Student.dept_name'],
      raw: true
    });
    // 예시 결과: [ { dept_name: '컴퓨터공학과', count: 18 }, { dept_name: '전자공학과', count: 14 }, … ]

    // 2) JSON 형태로 가공
    const deptDistribution = deptCounts.map(row => ({
      dept: row.dept_name,
      count: parseInt(row.count, 10)
    }));

    return res.json({
      lectureId,
      title: lecture.title,     // Lecture 모델에 title 컬럼이 있어야 합니다.
      deptDistribution
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
