import { envConfig } from '../../config/config.js';
import { postJson } from '../../helper/axios.js';
import { MODELS, getNewConnection, releaseConnection } from '../../sequelize.js';
import { ModelLogManager } from '../ModelLogHelper.js';
import { CMHelper } from './cmHelper.js';

const className = 'UserProfile';
const classNameUserXCompany = 'UserXCompany';

export class CMUserProfile extends CMHelper {
  static async basicList(querier) {
    const { companyId } = querier;
    const { UserXCompany } = MODELS;
    try {
      const list = await UserXCompany.findAll({
        where: { companyProfileId: companyId },
        raw: true,
      });
      return { ok: true, list };
    } catch (error) {
      return { ok: false, error: `Error fetching basic list: ${error.message}` };
    }
  }

  static async list(querier, where, options = {}) {
    const { claims, companyId } = querier;
    const { UserProfile, UserXCompany, AccessRole } = MODELS;

    const include = claims.profileType === 'userProfile'
      ? [{ model: MODELS.CompanyProfile, where: { id: companyId }, include: [AccessRole] }]
      : [];

    try {
      const list = await UserProfile.findAll({
        where,
        ...options,
        include,
      });
      return { ok: true, list };
    } catch (error) {
      return { ok: false, error: `Error fetching list: ${error.message}` };
    }
  }

  static async get(querier, id) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims, companyId } = querier;

    const include = claims.profileType === 'userProfile'
      ? [{ model: MODELS.CompanyProfile, where: { id: companyId } }]
      : [];

    try {
      const entity = await UserProfile.findByPk(id, { include });
      const detail = await entity?.get({ plain: true });
      if (!detail) throw new Error('No Data Found');

      const userXCompany = await UserXCompany.findOne({
        where: { userProfileId: detail.id, companyProfileId: companyId },
        plain: true,
      });

      if (userXCompany) {
        detail.hasGoogleCalendarToken = Boolean(userXCompany.googleCalendarToken);
        detail.hasXeroToken = Boolean(userXCompany.xeroToken);
        detail.hasFbToken = Boolean(userXCompany.longLivedFBToken);
      }

      return { ok: true, detail };
    } catch (error) {
      return { ok: false, error: `Error fetching profile: ${error.message}` };
    }
  }

  static async toggleStatus(querier, id, status) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims, companyId } = querier;

    try {
      const entity = await UserProfile.findByPk(id, { include: [] });
      if (!entity) throw new Error('No Data Found');

      const userXCompany = await UserXCompany.findOne({
        where: { userProfileId: entity.id, companyProfileId: companyId },
      });

      if (!userXCompany) throw new Error('User-Company relationship not found');

      await userXCompany.update({ status });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: `Error updating status: ${error.message}` };
    }
  }

  static async add(querier, data) {
    const { claims, companyId } = querier;
    const { Account, UserProfile, UserXCompany, CompanyProfile } = MODELS;
    const transaction = await getNewConnection();

    try {
      if (claims.profileType === 'userProfile' && claims.userProfile.companyProfiles[0].userXCompany.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }

      const companyProfile = await CompanyProfile.findByPk(companyId, { transaction });
      if (!companyProfile) throw new Error('Company not found');

      const userProfiles = await companyProfile.getUserProfiles({ transaction });
      if (userProfiles.length >= companyProfile.totalUsers && companyProfile.totalUsers !== 0) {
        throw new Error('Company account exceeded total user limit');
      }

      const password = data.password || '123';
      let userProfileEntity;
      const [accountEntity, created] = await Account.findOrCreate({
        where: { username: data.email },
        defaults: { username: data.email, password },
        transaction,
      });

      if (created) {
        userProfileEntity = await UserProfile.create(data, { transaction });
        await accountEntity.setUserProfile(userProfileEntity, { transaction });
      } else {
        userProfileEntity = await accountEntity.getUserProfile({ transaction });
      }

      const userXCompanyEntity = await UserXCompany.create({
        userProfileId: userProfileEntity.id,
        companyProfileId: companyProfile.id,
        role: data.role,
      }, { transaction });

      await transaction.commit();
      releaseConnection();

      ModelLogManager.log(querier, className, userProfileEntity.id, {}, userProfileEntity);

      if (created) {
        ModelLogManager.log(querier, 'Account', accountEntity.id, {}, accountEntity);
        await CMUserProfile.sendWelcomeEmail(userProfileEntity, password);
      }

      return { ok: true, id: userProfileEntity.id, userXCompanyId: userXCompanyEntity.id, detail: userProfileEntity };
    } catch (error) {
      await transaction.rollback();
      releaseConnection();
      return { ok: false, error: `Error adding user: ${error.message}` };
    }
  }

  static async update(querier, id, data) {
    const { UserProfile, UserXCompany } = MODELS;
    const { claims, companyId } = querier;

    try {
      const entity = await UserProfile.findByPk(id);
      if (!entity) throw new Error('No Data Found');
      if (entity.id !== id) throw new Error('Invalid Access');

      const userXCompany = await UserXCompany.findOne({
        where: { userProfileId: id, companyProfileId: companyId },
      });

      if (!userXCompany) throw new Error('Profile not found in company');

      await userXCompany.update({ role: data.role });
      await entity.update(data);

      const updatedEntity = await entity.get({ plain: true });
      ModelLogManager.log(querier, className, id, {}, updatedEntity);

      return { ok: true, detail: updatedEntity };
    } catch (error) {
      return { ok: false, error: `Error updating profile: ${error.message}` };
    }
  }

  static async sendWelcomeEmail(userProfile, password) {
    const { emailApiToken, emailApi, domain } = envConfig;
    const message = {
      to: userProfile.email,
      subject: 'WebCRM - Account Creation',
      html: `<h1>Welcome to WebCRM! Your account has been created. Please login using the following credentials:</h1><p>Email: ${userProfile.email}</p><p>Password: ${password}</p><p>CRM Website: ${domain}</p>`,
    };

    const data = { data: { smtpId: 2, message } };
    const headers = { Authorization: emailApiToken };

    const response = await postJson(emailApi, data, headers);
    console.log(response);
  }

  static makeid(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  }
}
