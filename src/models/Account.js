export default (sequelize, type) => {
  return sequelize.define(
    'account',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        allowNull: false,
        type: type.STRING,
      },
      password: {
        allowNull: false,
        type: type.STRING,
      },
      resetToken: {
        type: type.STRING,
      },
    },
    { indexes: [{ unique: true, fields: ['username'] }] },
    { paranoid: true }
  );
};
