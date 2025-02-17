export default (sequelize, type) => {
  return sequelize.define(
    'jwt',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        defaultValue: `ACTIVE`,
        type: type.TEXT,
      },
      token: {
        type: type.TEXT,
      },
      expire: {
        type: type.STRING,
      },
      profileType: {
        type: type.STRING,
      },
    },
    { paranoid: true }
  );
};
