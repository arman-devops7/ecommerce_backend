export default (sequelize, type) => {
  return sequelize.define(
    'accessRole',
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: type.STRING,
      },
      all: {
        type: type.TINYINT,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          name: `coyRoleName`,
          fields: ['name'],
        },
      ],
    }
  );
};
