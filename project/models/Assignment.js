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
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
});

module.exports = Assignment;