const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Attendance = sequelize.define('Attendance', {
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
    date : { 
        type: DataTypes.DATE, 
        primaryKey: true
    },
    status : { 
        type: DataTypes.STRING,  // Present, Absent
        allowNull: false 
    },
});

module.exports = Course;