const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const AssignmentSubmit = sequelize.define('AssignmentSubmit', {
  // course_id: DataTypes.STRING,
  // sec_id: DataTypes.STRING,
  // semester: DataTypes.INTEGER,
  // year: DataTypes.INTEGER,
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
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
});

module.exports = AssignmentSubmit;