export default (sequelize, type) => {
  return sequelize.define(
    'product',
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
      shortName: {
        type: type.STRING,
      },
      name: {
        allowNull: false,
        type: type.STRING,
      },
      desc: {
        type: type.TEXT,
      },
      model: {
        type: type.TEXT,
      },
    },
    { paranoid: true },
    {
      indexes: [{ unique: true, fields: ['name'] }],
    }
  );
};
