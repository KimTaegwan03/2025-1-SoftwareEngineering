const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Assignment = sequelize.define('Assignment', {
  // course_id: DataTypes.STRING,
  // sec_id: DataTypes.STRING,
  // semester: DataTypes.INTEGER,
  // year: DataTypes.INTEGER,
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lecture_id: DataTypes.INTEGER,
  writer: DataTypes.INTEGER,
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  reg_date: DataTypes.DATE,
  up_date: DataTypes.DATE,
  del_date: DataTypes.DATE
});

module.exports = Assignment;