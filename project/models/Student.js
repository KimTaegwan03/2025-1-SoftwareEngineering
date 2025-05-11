const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Student = sequelize.define('Student', {
    ID : {  type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true },
    name : { type: DataTypes.STRING, allowNull: false },
    dept_name: { type: DataTypes.STRING, allowNull: false },
    tot_cred: { type: DataTypes.INTEGER, allowNull: false },
    acc_id: { type: DataTypes.STRING, allowNull: false , unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Student;