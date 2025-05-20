const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Teaches = sequelize.define('Teaches', {
  id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  inst_id: DataTypes.INTEGER, // 교수 ID
  lecture_id: DataTypes.INTEGER, // 강의 ID
  // course_id: DataTypes.STRING,
  // sec_id: DataTypes.STRING
});

module.exports = Teaches;