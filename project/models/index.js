const sequelize = require('../db');

// 모델 import
const Advisor = require('./Advisor');
const Announcement = require('./Announcement');
const Assignment = require('./Assignment');
const Department = require('./Department');
const Enrollment = require('./Enrollment');
const Instructor = require('./Instructor');
const Lecture = require('./Lecture');
const Notice = require('./Notice');
const Question = require('./Question');
const Student = require('./Student');
const Syllabus = require('./Syllabus');
const Teaches = require('./Teaches');

// 관계 정의
// Advisor
Advisor.belongsTo(Student, { foreignKey: 's_id', targetKey: 'ID' });
Advisor.belongsTo(Instructor, { foreignKey: 'i_id', targetKey: 'ID' });

// Announcement (과목 공지사항)
Announcement.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Announcement.belongsTo(Instructor, { foreignKey: 'writer', targetKey: 'ID' });

// Assignment
Assignment.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Assignment.belongsTo(Instructor, { foreignKey: 'writer', targetKey: 'ID' });

// Enrollment
Enrollment.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Enrollment.belongsTo(Student, { foreignKey: 'studentId', targetKey: 'ID' });

// Lecture
Lecture.belongsTo(Department, { foreignKey: 'dept_name', targetKey: 'dept_name' });

// Notice (전체 공지사항)
Notice.belongsTo(Instructor, { foreignKey: 'writer', targetKey: 'ID' });

// Question
Question.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Question.belongsTo(Student, { foreignKey: 'writer', targetKey: 'ID' });

// Syllabus
Syllabus.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Syllabus.belongsTo(Instructor, { foreignKey: 'writer', targetKey: 'ID' });

// Teaches
Teaches.belongsTo(Instructor, { foreignKey: 'inst_id', targetKey: 'ID' });
Teaches.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });

module.exports = {
  sequelize,
  Advisor,
  Announcement,
  Assignment,
  Department,
  Enrollment,
  Instructor,
  Lecture,
  Notice,
  Question,
  Student,
  Syllabus,
  Teaches
};