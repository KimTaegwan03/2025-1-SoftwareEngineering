const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Attendance = sequelize.define('Attendance', {
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // 학생 학번
  },
  lecture_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // 강의 ID
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false, // 출석 날짜
    primaryKey: true
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false // 출석 상태 (예: '출석', '지각', '결석')
  }
}, {
  timestamps: false
});

module.exports = Attendance;