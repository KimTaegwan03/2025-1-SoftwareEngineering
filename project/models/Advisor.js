const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Advisor = sequelize.define('Advisor', {
  s_id: DataTypes.INTEGER, // 학생 학번
  i_id: DataTypes.INTEGER  // 교수 학번
});

module.exports = Advisor;