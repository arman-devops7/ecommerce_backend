export default (sequelize, type) => {
  return sequelize.define(
    'apiAccessLog',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ip: {
        allowNull: false,
        type: type.STRING,
      },
      profileId: {
        allowNull: false,
        type: type.INTEGER,
      },
      profileType: {
        allowNull: false,
        type: type.STRING,
      },
      companyProfileId: {
        type: type.INTEGER,
      },
      path: {
        allowNull: false,
        type: type.STRING,
      },
    },
    { paranoid: true }
  );
};
