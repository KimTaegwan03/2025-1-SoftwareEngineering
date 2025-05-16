const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Advisor = sequelize.define('Advisor', {
  s_id: DataTypes.STRING, // 학생 학번
  i_id: DataTypes.STRING  // 교수 학번
});

module.exports = Advisor;