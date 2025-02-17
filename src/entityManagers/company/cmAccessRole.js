import {
  MODELS,
  getNewConnection,
  releaseConnection,
} from '../../sequelize.js';
import Sequelize from 'sequelize';
import { ModelLogManager } from '../ModelLogHelper.js';
import { filterAvail } from '../../helper/entityhelper.js';
import { validateRight } from '../../models/ModelConstant.js';
const className = 'AccessRole';
const classNameRight = 'AccessRoleRight';
const Op = Sequelize.Op;
const accessRolePropNames = ['name', 'all'];
export class CMAccessRole {
  static async list(querier, where, options = {}) {
    const { AccessRole } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];

    try {
      const list = await AccessRole.findAll({
        where,
        ...options,
        include,
        raw: true,
      });
      return { ok: true, list };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async get(querier, id) {
    const { AccessRole, AccessRoleRight } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];
    include.push(AccessRoleRight);
    try {
      const entity = await AccessRole.findByPk(id, {
        include,
      });
      const detail = entity.get({ plain: true });
      if (!detail) throw Error(`No Data Found`);
      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async add(querier, data) {
    const { AccessRole, CompanyProfile } = MODELS;
    const { claims } = querier;

    try {
      if (`userProfile` === claims.profileType) {
        const querierRole =
          querier.userProfile.companyProfiles[0].userXCompany.role;
        if (!`ADMIN` === querierRole) throw Error(`Unauthorise`);
      }
      const companyProfileE = await CompanyProfile.findByPk(querier.companyId);
      if (!companyProfileE) throw Error(`Company Not Found`);
      const updateData = filterAvail(accessRolePropNames, data);
      updateData.companyProfileId = companyProfileE.id;
      const e = await AccessRole.create(updateData);
      const detail = await e.get({
        plain: true,
      });
      ModelLogManager.log(querier, className, detail.id, {}, detail);
      return await Promise.resolve(await this.get(querier, detail.id));
    } catch (error) {
      console.log(`error`, error);
      return Promise.resolve({ ok: false, error });
    }
  }
  static async update(querier, id, data) {
    const { AccessRole } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];
    try {
      const entity = await AccessRole.findByPk(id, { include });
      if (!entity) throw Error(`No Data Found`);
      if (entity.id != id) throw Error(`Invalid Access`);
      const oldEntity = { ...(await entity.get({ plain: true })) };
      const updateData = filterAvail(accessRolePropNames, data);
      await entity.update(updateData);
      const detail = await entity.get({ plain: true });
      ModelLogManager.log(querier, className, id, oldEntity, detail);
      return await Promise.resolve(await this.get(querier, detail.id));
    } catch (error) {
      console.log(`error??`, error);
      return Promise.resolve({ ok: false, error });
    }
  }

  static async addRight(querier, id, data) {
    const { AccessRole, AccessRoleRight } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];
    try {
      const { duration, passId } = data;
      const entity = await AccessRole.findByPk(id, { include });
      if (!entity) throw Error(`No Data Found`);
      if (entity.id != id) throw Error(`Invalid Access`);

      const { accessClassName, key } = data.accessRight;
      if (!validateRight(accessClassName, key)) throw Error(`Invalid Config`);

      const arrE = await AccessRoleRight.create({
        accessRoleId: id,
        accessClassName,
        key,
      });
      const detail = await arrE.get({ plain: true });
      ModelLogManager.log(querier, classNameRight, id, {}, detail);
      return await Promise.resolve({ ok: true, detail });
    } catch (error) {
      console.log(`error??`, error);
      return Promise.resolve({ ok: false, error });
    }
  }

  static async deleteRight(querier, id, accessRoleRightId) {
    const { AccessRole, AccessRoleRight } = MODELS;
    const { claims } = querier;
    const include =
      `userProfile` === claims.profileType
        ? [{ model: MODELS.CompanyProfile, where: { id: querier.companyId } }]
        : [];
    try {
      const entity = await AccessRole.findByPk(id, { include });
      if (!entity) throw Error(`No Data Found`);
      if (entity.id != id) throw Error(`Invalid Access`);

      let arrE = await AccessRoleRight.findByPk(accessRoleRightId, {
        include: [AccessRole],
      });
      if (!arrE) throw Error(`Invalid Assignment`);
      if (arrE.accessRole.id !== entity.id) throw Error(`Invalid Modification`);

      const oldEntity = { ...(await arrE.get({ plain: true })) };
      await arrE.destroy({force:true});
      const detail = await arrE.get({ plain: true });
      ModelLogManager.log(querier, classNameRight, id, oldEntity, detail);
      return await Promise.resolve({ ok: true, detail });
    } catch (error) {
      console.log(`error??`, error);
      return Promise.resolve({ ok: false, error });
    }
  }
}
