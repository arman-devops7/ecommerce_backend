export default (sequelize, type) => {
  return sequelize.define(
    'productCategory',
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
      name: {
        allowNull: false,
        type: type.STRING,
      },
    },
    { paranoid: true },
    {
      indexes: [{ unique: true, fields: ['name'] }],
    }
  );
};
