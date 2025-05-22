const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Teams = sequelize.define('Teams', {
	dept: { type: DataTypes.STRING, primaryKey: true }, // ex) 학생복지팀
	acc_id: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Teams;