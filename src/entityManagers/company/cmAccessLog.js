import { MODELS } from '../../sequelize.js';
const className = 'ApiAccessLog';
export class CMAccessLog {
  static async list(querier, where, options = {}) {
    const { claims, companyId } = querier;
    const { ApiAccessLog, UserProfile } = MODELS;
    where.companyProfileId = companyId;
    console.log(`options?`, options);
    try {
      const list = await ApiAccessLog.findAll({
        where,
        ...options,
        attributes: ['id', 'ip', 'profileId', 'profileType', 'path', 'createdAt'],
        raw: true,
      });
      for (const row of list) {
        const { profileId, profileType } = row;
        switch (profileType) {
          case `userProfile`:
            const profile = await UserProfile.findByPk(profileId, {
              raw: true,
            });
            row.profile = profile;
            break;
        }
      }
      return { ok: true, list };
    } catch (error) {
      console.log(error);
      return Promise.resolve({ ok: false, error });
    }
  }
}
