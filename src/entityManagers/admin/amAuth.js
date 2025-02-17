import { MODELS } from '../../sequelize.js';
const classIdentifier = 'Admin Auth';

export class AMAuth {
  static async login(querier, username, password) {
    const { Account, AdminProfile } = MODELS;
    return await Account.findOne({
      where: { username, password },
      include: [AdminProfile],
      raw: true,
      nest: true,
    });
  }

  static async profile(querier) {
    const { AdminProfile } = MODELS;
    return await AdminProfile.findByPk(querier.claims.id, {
      raw: true,
    });
  }
}
