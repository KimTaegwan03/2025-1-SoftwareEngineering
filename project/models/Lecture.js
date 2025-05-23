const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Lecture = sequelize.define('Lecture', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});


module.exports = Lecture;
