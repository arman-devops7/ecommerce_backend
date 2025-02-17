import { envConfig } from '../../config/config.js';
import { postJson } from '../../helper/axio.js';
import {
  MODELS,
  getNewConnection,
  releaseConnection,
} from '../../sequelize.js';
import { ModelLogManager } from '../ModelLogHelper.js';
import { CMHelper } from './cmHelper.js';

const className = 'UserProfile';
const classNameUserXCompany = 'UserXCompany';
export class CMUserProfile extends CMHelper {
  static async basicList(querier) {
    const { claims, companyId } = querier;
    const { UserProfile, UserXCompany } = MODELS;
    try {
      const list = await UserXCompany.findAll({
        where: { companyProfileId: companyId },
        raw: true,
      });
      return { ok: true, list };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async list(querier, where, options = {}) {
    const { claims } = querier;
    const { UserProfile, UserXCompany, AccessRole } = MODELS;
    const include =
      `userProfile` === claims.profileType
        ? [
            {
              model: MODELS.CompanyProfile,
              where: { id: querier.companyId },
              include: [AccessRole],
            },
          ]
        : [];

    try {
      const list = await UserProfile.findAll({
        where,
        ...options,
        include,
      });
      return { ok: true, list };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async get(querier, id) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];

    try {
      const entity = await UserProfile.findByPk(id, {
        include,
      });
      const detail = await entity.get({ plain: true });
      if (!detail) throw Error(`No Data Found`);
      const userXCompany = await UserXCompany.findOne({
        where: {
          userProfileId: detail.id,
          companyProfileId: querier.companyId,
        },

        plain: true,
      });
      if (userXCompany.googleCalendarToken) {
        detail.hasGoogleCalendarToken = true;
      }

      if (userXCompany.xeroToken) {
        detail.hasXeroToken = true;
      }

      if (userXCompany.longLivedFBToken) {
        detail.hasFbToken = true;
      }

      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async active(querier, id) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];

    try {
      const entity = await UserProfile.findByPk(id, {
        include,
      });
      const userXCompany = await UserXCompany.findOne({
        where: {
          userProfileId: entity.id,
          companyProfileId: querier.companyId,
        },
      });
      await userXCompany.update({ status: 'active' });
      return Promise.resolve({ ok: true });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async inactive(querier, id) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];

    try {
      const entity = await UserProfile.findByPk(id, {
        include,
      });
      const userXCompany = await UserXCompany.findOne({
        where: {
          userProfileId: entity.id,
          companyProfileId: querier.companyId,
        },
      });
      await userXCompany.update({ status: 'inactive' });
      return Promise.resolve({ ok: true });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async add(querier, data) {
    const { claims } = querier;

    const { Account, UserProfile, UserXCompany, CompanyProfile } = MODELS;
    const t = await getNewConnection();
    const co = { transaction: t };
    try {
      if (`userProfile` === claims.profileType) {
        const querierRole =
          querier.userProfile.companyProfiles[0].userXCompany.role;
        if (!`ADMIN` === querierRole) throw Error(`Unauthorise`);
      }
      const companyProfileE = await CompanyProfile.findByPk(
        querier.companyId,
        co
      );
      const userProfiles = await companyProfileE.getUserProfiles(co);
      if (
        userProfiles.length >= companyProfileE.totalUsers &&
        companyProfileE.totalUsers !== 0
      )
        throw Error(`Company Account Exceeded Total Users Allow`);
      console.log(`userProfiles?`, userProfiles.length);
      let userXCompanyId;
      if (!companyProfileE) throw Error(`Company Not Found`);
      let newAccount, newUserProfile;
      const password = data.password ? data.password : '123';

      const userProfileE = await Account.findOrCreate({
        where: { username: data.email },
        defaults: { username: data.email, password: password },
        ...co,
      }).spread(async (accountE, created) => {
        let userProfileE;
        if (created) {
          //new
          newAccount = accountE;
          userProfileE = await UserProfile.create(data, co);
          userProfileE.created = true;
          newUserProfile = userProfileE;
          await accountE.setUserProfile(userProfileE, co);
        } else {
          userProfileE = await accountE.getUserProfile(co);
        }
        const userXCompanyE = await UserXCompany.create(
          {
            userProfileId: userProfileE.id,
            companyProfileId: companyProfileE.id,
            role: data.role,
          },
          co
        );
        userXCompanyId = userXCompanyE.id;
        return userProfileE;
      });
      const userProfileE_id = userProfileE.id;
      await t.commit();
      releaseConnection();
      ModelLogManager.log(
        querier,
        className,
        userProfileE.id,
        {},
        userProfileE
      );
      if (newAccount)
        ModelLogManager.log(querier, `Account`, newAccount.id, {}, newAccount);

      const entity = await UserProfile.findByPk(userProfileE_id, {
        include: [{ model: CompanyProfile, where: { id: querier.companyId } }],
      });
      if (!entity) throw Error(`Something went wrong`);
      const detail = await entity.get({ plain: true });
      console.log(`done?`);

      //send email if newly created user
      if (userProfileE.created) {
        const { emailApiToken, emailApi, domain } = envConfig;
        const message = {
          to: userProfileE.email,
          subject: `WebCRM - Account Creation`,
          html: `<h1>Welcome to WebCRM your account has been created, Please login on the CRM using the given credentials. Email: ${userProfileE.email} Password: ${password}  CRM Website: ${domain}</h1>`,
        };
        const data = { data: { smtpId: 2, message } };

        const headerAddons = {};
        headerAddons[`Authorization`] = emailApiToken;
        const res = await postJson(emailApi, data, headerAddons);
        console.log(res);
      }

      return Promise.resolve({
        ok: true,
        id: userProfileE_id,
        userXCompanyId,
        detail: detail,
      });
    } catch (error) {
      await t.rollback().catch((err) => {
        console.log(`rollback fail`, err);
      });
      releaseConnection();
      return Promise.resolve({ ok: false, error });
    }
  }
  static async update(querier, id, data) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims } = querier;
    const include = [];
    try {
      const entity = await UserProfile.findByPk(id, { include });
      if (!entity) throw Error(`No Data Found`);
      if (entity.id != id) throw Error(`Invalid Access`);
      const oldEntity = { ...(await entity.get({ plain: true })) };
      const uxcE = await UserXCompany.findOne({
        where: { userProfileId: id, companyProfileId: querier.companyId },
      });
      if (`ADMIN` != uxcE.role) {
        if (!uxcE) throw Error(`Profile Not Found`);
        await uxcE.update({ role: data.role });
      }
      const { name, contact, role, jobTitle } = data;
      await entity.update({ name, contact, role, jobTitle });

      const detail = await entity.get({ plain: true });
      ModelLogManager.log(querier, className, id, oldEntity, detail);
      return await Promise.resolve(await this.get(querier, detail.id));
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async assignRole(querier, id, data) {
    const { UserProfile, UserXCompany, AccessRole } = MODELS;
    const { claims } = querier;
    const include = await this.getStdInc(querier, className);
    try {
      const entity = await UserProfile.findByPk(id);
      if (!entity) throw Error(`No Profile Found`);
      if (entity.id != id) throw Error(`Invalid Access`);
      const uxcE = await UserXCompany.findOne({
        where: { userProfileId: id, companyProfileId: querier.companyId },
      });
      if (!uxcE) throw Error(`No Profile Found (2)`);
      const { accessRoleId } = data;
      const accessRoleE = await AccessRole.findByPk(accessRoleId, { include });
      if (!accessRoleE) throw Error(`No Access Role Found`);
      const oldEntity = { ...(await uxcE.get({ plain: true })) };
      await uxcE.update({ accessRoleId });
      const detail = await uxcE.get({ plain: true });
      ModelLogManager.log(
        querier,
        classNameUserXCompany,
        id,
        oldEntity,
        detail
      );
      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async uploadProfilePic(querier, id, profilePicFile) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];
    try {
      const entity = await UserProfile.findByPk(id, { include });
      if (!entity) throw Error(`No Data Found`);
      if (entity.id != id) throw Error(`Invalid Access`);
      if (entity.id != claims.id) throw Error(`Invalid Access`);
      const oldEntity = { ...(await entity.get({ plain: true })) };
      await entity.update({ profilePicFile });

      const detail = await entity.get({ plain: true });
      ModelLogManager.log(querier, className, id, oldEntity, detail);
      return await Promise.resolve(await this.get(querier, detail.id));
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async generateSSO(querier, id) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];
    try {
      const entity = await UserProfile.findByPk(id, {
        include,
      });
      if (!entity) throw Error(`No Data Found`);
      let userXCoyE = await UserXCompany.findOne({
        where: { userProfileId: id, companyProfileId: querier.companyId },
      });
      userXCoyE = await userXCoyE.update({ ssoToken: this.makeid(16) });
      const detail = userXCoyE.get({ plain: true });
      if (!detail) throw Error(`No Data Found`);
      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async connectGoogleCalendar(querier) {
    const { UserXCompany } = MODELS;
    const { userXCompanyId } = querier;
    try {
      const uxcE = await UserXCompany.findByPk(userXCompanyId);
      if (!uxcE) throw Error(`No Profile Found (2)`);
      const ssoToken = this.makeid(16);
      await uxcE.update({ ssoToken });
      return Promise.resolve({ ok: true, ssoToken, uxid: uxcE.id });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async connectSuccessGoogleCalendar(token, ssoToken, uxid) {
    const { UserXCompany } = MODELS;
    try {
      const uxcE = await UserXCompany.findOne({
        where: { ssoToken, id: uxid },
      });
      if (!uxcE) throw Error(`No Profile Found (2)`);
      await uxcE.update({ googleCalendarToken: token });
      return Promise.resolve({ ok: true });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
