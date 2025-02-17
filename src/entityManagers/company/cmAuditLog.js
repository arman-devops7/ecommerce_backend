import { MODELS } from '../../sequelize.js';
const className = 'ModelLog';
export class CMAuditLog {
  static async list(querier, where, options = {}) {
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];
    const { ModelLog, UserProfile } = MODELS;
    console.log(`where?`, where);
    try {
      const list = await ModelLog.findAll({
        where,
        ...options,
        include,
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
      return Promise.resolve({ ok: false, error });
    }
  }
}
