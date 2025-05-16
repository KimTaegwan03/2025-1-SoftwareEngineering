const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Lecture = sequelize.define('Lecture', {
  course_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sec_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dept_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  credit: {
    type: DataTypes.INTEGER,
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
  building: {
    type: DataTypes.STRING,
    allowNull: false
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scheduleDay: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scheduleTimes: {
    type: DataTypes.JSON,
    allowNull: false
  },
  professor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});


module.exports = Lecture;
