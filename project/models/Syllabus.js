const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Lecture = require('./Lecture');

const Syllabus = sequelize.define('Syllabus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lectureId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Lectures',
      key: 'id'
  },
  field: 'lecture_id'
},
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false
});

// ✅ 이 위치에서 관계 정의 가능
// Syllabus.belongsTo(Lecture, { foreignKey: 'lectureId' });   // index.js에서 설정

module.exports = Syllabus;
