const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Takes = sequelize.define('Takes', {
    student_id : {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    course_id : { 
        type: DataTypes.INTEGER, 
        primaryKey: true
    },
    sec_id : { 
        type: DataTypes.INTEGER, 
        primaryKey: true
    },
    semester : { 
        type: DataTypes.INTEGER, 
        primaryKey: true
    },
    year : { 
        type: DataTypes.INTEGER, 
        primaryKey: true
    },
    grade : { 
        type: DataTypes.STRING,  // A+, A, B+, B, C+, C, D+, D, F
        allowNull: false 
    }, 
});

module.exports = Takes;