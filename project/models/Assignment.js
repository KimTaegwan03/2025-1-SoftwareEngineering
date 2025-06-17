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
  lecture_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
  },
  start_dt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_dt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Assignment;