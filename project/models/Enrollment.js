const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Lecture = require('./Lecture');

const Enrollment = sequelize.define('Enrollment', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lectureId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Enrollment.belongsTo(Lecture, { foreignKey: 'lectureId' });

module.exports = Enrollment;
