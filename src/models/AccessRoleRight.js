export default (sequelize, type) => {
  return sequelize.define(
    'accessRoleRight',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accessClassName: {
        allowNull: false,
        type: type.STRING,
      },
      key: {
        allowNull: false,
        type: type.STRING,
      },
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          name: `roleRights`,
          fields: ['accessRoleId', 'accessClassName', 'key'],
        },
      ],
    }
  );
};
