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
   scheduleDay: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scheduleTimes: {
    type: DataTypes.JSON,  //  1~3교시 → [1,2,3]
    allowNull: false
  },
    maxSeats: {                     
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Lecture;
