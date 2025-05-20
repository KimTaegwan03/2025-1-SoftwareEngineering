const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  writer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING, // image url
  },
  reg_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  up_date: {
    type: DataTypes.DATE,
  },
  del_date: {
    type: DataTypes.DATE,
  },
});

module.exports = Notice;