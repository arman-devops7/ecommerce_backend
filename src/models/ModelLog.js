export default (sequelize, type) => {
  return sequelize.define(
    'modelLog',
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
        type: type.STRING,
      },
      profileType: {
        allowNull: false,
        type: type.STRING,
      },
      docType: {
        allowNull: false,
        type: type.STRING,
      },
      docId: {
        allowNull: false,
        type: type.INTEGER,
      },
      parentDocId: {
        type: type.INTEGER,
      },
      pastData: {
        type: type.TEXT,
      },
      newData: {
        type: type.TEXT,
      },
    },
    { paranoid: true }
  );
};
