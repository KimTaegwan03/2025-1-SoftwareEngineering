const { DataTypes } = require('sequelize');
const sequelize = require('../db');
// backend/models/Review.js
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    lecture_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER, // 1~5
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'reviews',
    timestamps: true
  });

  // 관계
  Review.associate = models => {
    Review.belongsTo(models.Lecture, { foreignKey: 'lecture_id' });
    Review.belongsTo(models.Student, { foreignKey: 'student_id' });
  };

  return Review;
};
