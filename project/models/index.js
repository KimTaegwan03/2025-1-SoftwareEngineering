const sequelize = require('../db');

// 모델 import
const Advisor = require('./Advisor');
const Announcement = require('./Announcement');
const Assignment = require('./Assignment');
const AssignmentSubmit = require('./AssignmentSubmit');
const Department = require('./Department');
const Enrollment = require('./Enrollment');
const Instructor = require('./Instructor');
const Lecture = require('./Lecture');
const Notice = require('./Notice');
const Question = require('./Question');
const Answer = require('./Answer');
const Student = require('./Student');
const Syllabus = require('./Syllabus');
const Teams = require('./Teams')
const Attendance = require('./Attendance');

// 관계 정의
// Advisor
Advisor.belongsTo(Student, { foreignKey: 's_id', targetKey: 'ID' });
Advisor.belongsTo(Instructor, { foreignKey: 'i_id', targetKey: 'ID' });

// Announcement (과목 공지사항)
Announcement.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id', as: 'lecture'});

// Assignment
Assignment.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
AssignmentSubmit.belongsTo(Assignment, { foreignKey: 'assignment_id', targetKey: 'id' });
AssignmentSubmit.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'ID' });

// Enrollment
Enrollment.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Enrollment.belongsTo(Student, { foreignKey: 'studentId', targetKey: 'ID' });

// Lecture
Lecture.belongsTo(Department, { foreignKey: 'dept_name', targetKey: 'dept_name' });
Lecture.belongsTo(Instructor, { foreignKey: 'instructor_id', targetKey: 'ID' });

// Notice (전체 공지사항)
Notice.belongsTo(Teams, { foreignKey: 'writer', targetKey: 'dept' });

// Question
Question.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Question.belongsTo(Student, { foreignKey: 'writer_id', targetKey: 'ID' });
Answer.belongsTo(Question, { foreignKey: 'question_id', targetKey: 'id' });
Answer.belongsTo(Instructor, { foreignKey: 'writer_id', targetKey: 'ID' });

// Syllabus
Syllabus.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });
Syllabus.belongsTo(Instructor, { foreignKey: 'writer', targetKey: 'ID' });

//Attendance
Attendance.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'ID' });
Attendance.belongsTo(Lecture, { foreignKey: 'lecture_id', targetKey: 'id' });

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
  Answer,
  Student,
  Syllabus,
  Teams,
  Attendance
};