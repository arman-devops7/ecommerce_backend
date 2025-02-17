import { MODELS } from '../../sequelize.js';
export class AdminManager {
  static async findAccount(username, password) {
    return await MODELS.Account.findOne({
      where: { username, password },
      raw: true,
    });
  }
}
