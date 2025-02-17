import { MODELS, getNewConnection, releaseConnection } from '../../sequelize.js';
import { ModelLogManager } from '../ModelLogHelper.js';
const className = 'CompanyProfile';
export class AMCompanyProfile {
  static async list(querier, where, options = {}) {
    const { CompanyProfile } = MODELS;
    try {
      const list = await CompanyProfile.findAll({
        where,
        ...options,
        raw: true,
      });
      return { ok: true, list };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async get(querier, id) {
    const { CompanyProfile, UserProfile, Account } = MODELS;
    try {
      const detail = await CompanyProfile.findByPk(id, {
        include: [{ model: UserProfile, include: Account }],
        plain: true,
      });
      if (!detail) throw Error(`No Data Found`);
      return { ok: true, detail };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async add(querier, data) {
    const { Account, UserProfile, UserXCompany, CompanyProfile } = MODELS;
    const t = await getNewConnection();
    const co = { transaction: t };
    try {
      if (!data.rootName || !data.rootEmail || !data.rootPassword)
        throw Error(`Root/Admin Information Required`);
      const entity = await CompanyProfile.create(data, co);
      let newAccount, newUserProfile;
      await Account.findOrCreate({
        where: { username: data.rootEmail },
        defaults: { username: data.rootEmail, password: data.rootPassword },
        ...co,
      }).spread(async (accountE, created) => {
        let userProfileE;
        if (created) {
          //new
          newAccount = accountE;
          userProfileE = await UserProfile.create(
            { name: data.rootName, email: data.rootEmail },
            co
          );
          newUserProfile = userProfileE;
          await accountE.setUserProfile(userProfileE, co);
          console.log(`setted`);
        } else {
          userProfileE = await accountE.getUserProfile(co);
        }
        const userXCompanyE = await UserXCompany.create(
          {
            userProfileId: userProfileE.id,
            companyProfileId: entity.id,
            role: 'ADMIN',
          },
          co
        );
        return;
      });

      const detail = await entity.get({ plain: true, ...co });
      await t.commit();
      releaseConnection();

      ModelLogManager.log(querier, className, detail.id, {}, detail);
      if (newAccount) ModelLogManager.log(querier, `Account`, newAccount.id, {}, newAccount);
      if (newUserProfile)
        ModelLogManager.log(querier, `UserProfile`, newUserProfile.id, {}, newUserProfile);

      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      await t.rollback().catch((err) => {
        console.log(`rollback fail`, err);
      });
      releaseConnection();
      return Promise.resolve({ ok: false, error });
    }
  }
  static async update(querier, id, data) {
    const { CompanyProfile } = MODELS;
    try {
      const entity = await CompanyProfile.findByPk(id);
      if (!entity) throw Error(`No Data Found`);
      if (entity.id != id) throw Error(`Invalid Access`);
      const oldEntity = { ...(await entity.get({ plain: true })) };
      await entity.update(data);
      const detail = await entity.get({ plain: true });
      ModelLogManager.log(querier, className, id, oldEntity, detail);
      return { ok: true, detail };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async resetUserPassword(querier, id, userProfileId) {
    const { CompanyProfile, UserProfile, Account } = MODELS;
    try {
      const entity = await CompanyProfile.findByPk(id, {
        include: [{ model: UserProfile, where: { id: userProfileId }, include: Account }],
      });
      await entity.userProfiles[0].account.update({ password: 123 });
      return { ok: true };
    } catch (error) {
      console.log(`errr?`, error);
      return Promise.resolve({ ok: false, error });
    }
  }
}
