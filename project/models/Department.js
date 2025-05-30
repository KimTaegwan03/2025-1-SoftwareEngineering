const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Department = sequelize.define('Department', {
  dept_name: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  building: DataTypes.STRING,
  gradCreds: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  timestamps: false
});

module.exports = Department;