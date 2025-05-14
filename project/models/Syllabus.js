const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Lecture = require('./Lecture');

const Syllabus = sequelize.define('Syllabus', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

// 관계 설정
Syllabus.belongsTo(Lecture, { foreignKey: 'lectureId' });

module.exports = Syllabus;
