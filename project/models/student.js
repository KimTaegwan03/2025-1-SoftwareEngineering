const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Student = sequelize.define('Student', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    dept_name: { type: DataTypes.STRING, allowNull: false },
    tot_cred: { type: DataTypes.INTEGER, allowNull: false },
    acc_id: { type: DataTypes.STRING, allowNull: false, unique: true }, // account id
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false
});

module.exports = Student;