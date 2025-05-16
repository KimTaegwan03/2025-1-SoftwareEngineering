const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Lecture = require('./Lecture');

const Syllabus = sequelize.define('Syllabus', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// ✅ 이 위치에서 관계 정의 가능
Syllabus.belongsTo(Lecture, { foreignKey: 'lectureId' });

module.exports = Syllabus;
