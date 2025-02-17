import Sequelize from 'sequelize';
import moment from 'moment';
import { envConfig } from './config/config.js';
import { AdminManager } from './entityManagers/admin/adminManager.js';
import ModelLogModel from './models/ModelLog.js';
import ApiAccessLogModel from './models/ApiAccessLog.js';
import AccountModel from './models/Account.js';
import AdminProfileModel from './models/AdminProfile.js';
import UserProfileModel from './models/UserProfile.js';
import JwtModel from './models/Jwt.js';
import AccessRoleModel from './models/AccessRole.js';
import AccessRoleRightModel from './models/AccessRoleRight.js';
import ProductCategoryModel from './models/ProductCategory.js';
import ProductModel from './models/Product.js';

export let sequelize;
export const MODELS = {};

export const startConnection = async () => {
  try {
    const db = envConfig.db;
    console.log(`sequelize db??`, db);

    sequelize = new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        pool: {
          max: 5000,
          min: 0,
          acquire: 30000,
          idle: 10000,
          charset: 'utf8mb4',
        },
        timezone: '+08:00',
        logging: false,
      }
    );

    const mandatory = {
      foreignKey: {
        allowNull: false,
      },
    };

    // Initialize models
    MODELS.ModelLog = ModelLogModel(sequelize, Sequelize);
    MODELS.ApiAccessLog = ApiAccessLogModel(sequelize, Sequelize);
    MODELS.Account = AccountModel(sequelize, Sequelize);

    MODELS.AdminProfile = AdminProfileModel(sequelize, Sequelize);
    MODELS.Account.hasOne(MODELS.AdminProfile);
    MODELS.AdminProfile.belongsTo(MODELS.Account);

    MODELS.UserProfile = UserProfileModel(sequelize, Sequelize);
    MODELS.Account.hasOne(MODELS.UserProfile);
    MODELS.UserProfile.belongsTo(MODELS.Account);

    MODELS.Jwt = JwtModel(sequelize, Sequelize);
    MODELS.UserProfile.hasMany(MODELS.Jwt, { ...mandatory });
    MODELS.Jwt.belongsTo(MODELS.UserProfile);

    MODELS.AccessRole = AccessRoleModel(sequelize, Sequelize);
    MODELS.AccessRole.hasMany(MODELS.UserProfile);
    MODELS.UserProfile.belongsTo(MODELS.AccessRole);

    MODELS.AccessRoleRight = AccessRoleRightModel(sequelize, Sequelize);
    MODELS.AccessRole.hasMany(MODELS.AccessRoleRight, { ...mandatory });
    MODELS.AccessRoleRight.belongsTo(MODELS.AccessRole);

    // Product category and product models
    MODELS.ProductCategory = ProductCategoryModel(sequelize, Sequelize);
    MODELS.Product = ProductModel(sequelize, Sequelize);
    MODELS.ProductCategory.hasMany(MODELS.Product, { ...mandatory });
    MODELS.Product.belongsTo(MODELS.ProductCategory);

    // Sync database based on config flags
    if (db.syncForce || db.syncAlter) await syncDB();
    if (db.seekAccount) await syncSeekAccount();

  } catch (error) {
    console.error("Error starting the connection:", error);
  }
};

// Function to create random string
function makeid(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Sync the database based on environment settings
const syncDB = async () => {
  try {
    const db = envConfig.db;
    console.log(`syncDB??`, db);

    const ok = await sequelize.sync({ force: db.syncForce, alter: db.syncAlter });
    if (ok) console.log(`Database & tables synced!`, db.syncForce, db.syncAlter);
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
};

// Sync the seek account, ensure it exists in the database
const syncSeekAccount = async () => {
  try {
    console.log(`syncSeekAccount - triggering`);
    const db = envConfig.db;
    const seek = db.seek;

    const seekAccount = await AdminManager.findAccount(seek.username, seek.password);

    if (!seekAccount) {
      const newAccount = await MODELS.Account.create({
        username: seek.username,
        password: seek.password,
      });
      const adminProfile = await MODELS.AdminProfile.create({
        name: seek.username,
        email: seek.username,
      });
      await newAccount.setAdminProfile(adminProfile);

      const userProfile = await MODELS.UserProfile.create({
        name: seek.username,
        email: seek.username,
      });
      await newAccount.setUserProfile(userProfile);

      console.log(`syncSeekAccount - seek account created`);
    }

    console.log(`syncSeekAccount - Done`);
  } catch (error) {
    console.error("Error syncing seek account:", error);
  }
};

// Connection pooling and management
let connectionReleased = 0;

export const getNewConnection = async () => {
  if (connectionReleased < 50) {
    connectionReleased++;
    return await sequelize.transaction();
  }

  // Wait and retry after 1 second if connections are maxed out
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return getNewConnection();
};

// Automatically release connection every 10 seconds to free up resources
setInterval(() => {
  if (connectionReleased > 0) {
    connectionReleased--;
  }
}, 10000);

export const releaseConnection = () => {
  connectionReleased--;
};
