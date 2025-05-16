const Teaches = sequelize.define('Teaches', {
  ID: DataTypes.STRING, // 교수 ID
  course_id: DataTypes.STRING,
  sec_id: DataTypes.STRING
});

module.exports = Teaches;