const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Lecture = sequelize.define('Lecture', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  professor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  credit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  schedule: {
    type: DataTypes.STRING, // 예: "월요일 3교시"
    allowNull: false
  }
});

module.exports = Lecture;
