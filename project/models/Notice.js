const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  writer: DataTypes.STRING,
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  reg_date: DataTypes.DATE,
  up_date: DataTypes.DATE,
  del_date: DataTypes.DATE
});

module.exports = Notice;