const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Lecture = require('./Lecture');

const Enrollment = sequelize.define('Enrollment', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  lecture_id: {  // 기존 관계 유지용
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  grade: {
    type: DataTypes.STRING, // 예: A+, A0, B+
    allowNull: true
  }
}, {
  timestamps: false
});

// Enrollment.belongsTo(Lecture, { foreignKey: 'lectureId' });  index.js에서 설정

module.exports = Enrollment;
