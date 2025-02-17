import { MODELS } from '../sequelize.js';
export class ApiLogManager {
  static async log(querier, path) {
    const { ApiAccessLog } = MODELS;
    const { claims } = querier;

    const companyProfileId = querier.companyId || 0;
    const profileType = claims.profileType;
    const profile = querier[claims.profileType];
    const profileId = profile.id;

    ApiAccessLog.create({
      ip: querier.ip,
      profileType,
      profileId,
      companyProfileId,
      path,
    });
  }
}
