const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Lecture = require('./Lecture');

const Enrollment = sequelize.define('Enrollment', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  course_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sec_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING, // 예: A+, A0, B+
    allowNull: true
  },
  lectureId: {  // 기존 관계 유지용
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Enrollment.belongsTo(Lecture, { foreignKey: 'lectureId' });

module.exports = Enrollment;
