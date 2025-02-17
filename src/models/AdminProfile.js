export default (sequelize, type) => {
  return sequelize.define(
    'adminProfile',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        allowNull: false,
        type: type.STRING,
      },
      email: {
        allowNull: false,
        type: type.STRING,
      },
      jwtVersion: {
        type: type.INTEGER,
        defaultValue: 0,
      },
    },
    { paranoid: true }
  );
};
