import bcrypt from 'bcrypt';

export default (sequelize, type) => {
  const Account = sequelize.define(
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
    {
      indexes: [{ unique: true, fields: ['username'] }],
      paranoid: true, // Soft delete support
    }
  );

  // Add a method to validate passwords
  Account.prototype.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Automatically hash the password before creating or updating a user
  Account.beforeCreate(async (account, options) => {
    if (account.password) {
      const saltRounds = 10; // You can adjust the number of rounds for security/performance
      account.password = await bcrypt.hash(account.password, saltRounds);
    }
  });
  Account.beforeUpdate(async (account, options) => {
    if (account.changed('password')) {
      const saltRounds = 10;
      account.password = await bcrypt.hash(account.password, saltRounds);
    }
  });

  return Account;
};