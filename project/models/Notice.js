const { DataTypes } = require('sequelize');
const sequelize = require('../db');

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
  image_url: {
    type: DataTypes.STRING, // image url
  },
}, {
  timestamps: true // createdAt, updatedAt 자동 추가
});

module.exports = Notice;