const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Answer = sequelize.define('Answer', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	question_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	writer_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: false
	}
});

module.exports = Answer;