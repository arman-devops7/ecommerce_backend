export default (sequelize, type) => {
  return sequelize.define(
    'userProfile',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        allowNull: false,
        type: type.STRING,
        defaultValue: `active`,
      },
      role: {
        allowNull: false,
        type: type.STRING,
        defaultValue: `ADMIN`,
      },
      name: {
        allowNull: false,
        type: type.STRING,
      },
      email: {
        type: type.STRING,
      },
      contact: {
        type: type.STRING,
      },
      jobTitle: {
        type: type.STRING,
      },
      profilePicFile: {
        type: type.STRING,
      },
    },
    {
      indexes: [
        { unique: true, fields: ['contact'] },
        { unique: true, fields: ['profilePicFile'] },
      ],
    },
    { paranoid: true }
  );
};
