const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Instructor = sequelize.define('Instructor', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    dept_name: { type: DataTypes.STRING, allowNull: false },
    acc_id: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: false
});

module.exports = Instructor;