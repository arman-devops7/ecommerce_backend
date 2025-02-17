import {
  MODELS,
  getNewConnection,
  releaseConnection,
} from '../../sequelize.js';
import { filterAvail } from '../../helper/entityhelper.js';
import { ModelLogManager } from '../ModelLogHelper.js';
import { CMHelper } from './cmHelper.js';

const className = 'ProductCategory';
const propNames = ['name', 'shortName', 'desc'];

export class CMProductCategory extends CMHelper {
  static async list(querier, where, options = {}) {
    const { claims } = querier;
    const { ProductCategory } = MODELS;
    const include = [];

    try {
      const list = await ProductCategory.findAll({
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
    const { ProductCategory } = MODELS;
    const { claims } = querier;
    const include = [];

    try {
      const entity = await ProductCategory.findByPk(id, {
        include,
      });
      const detail = await entity.get({ plain: true });
      if (!detail) throw Error(`No Data Found`);

      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async add(querier, data) {
    const { claims } = querier;
    const { ProductCategory } = MODELS;
    try {
      const updateData = filterAvail(propNames, data);
      const e = await ProductCategory.create(updateData);
      console.log(`this is eee?`, e);
      const detail = await e.get({ plain: true });
      console.log(`this is detail?`, detail);
      // ModelLogManager.log(querier, className, detail.id, {}, detail);
      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async update(querier, id, data) {
    const { ProductCategory } = MODELS;
    const { claims } = querier;
    const include = [];
    try {
      const entity = await ProductCategory.findByPk(id, { include });
      if (!entity) throw Error(`No Data Found`);
      const oldEntity = { ...(await entity.get({ plain: true })) };
      const updateData = filterAvail(propNames, data);
      await entity.update(updateData);

      const detail = await entity.get({ plain: true });
      // ModelLogManager.log(querier, className, id, oldEntity, detail);
      return await Promise.resolve(await this.get(querier, detail.id));
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static async stallAdd(querier, id, data) {
    const { ProductCategory, Stall } = MODELS;
    const { claims } = querier;
    const include = [];
    try {
      const entity = await ProductCategory.findByPk(id, { include });
      if (!entity) throw Error(`No Data Found`);
      const updateData = filterAvail(propNamesStall, data);
      updateData.outletId = id;
      const e2 = await Stall.create(updateData);
      const detail = await e2.get({ plain: true });

      ModelLogManager.log(querier, classNameStall, detail.id, {}, detail);
      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async stallUpdate(querier, id, stallId, data) {
    const { ProductCategory, Stall } = MODELS;
    const { claims } = querier;
    try {
      const entity = await Stall.findByPk(stallId, {
        include: [{ model: ProductCategory, where: { id }, required: true }],
      });
      if (!entity) throw Error(`No Data Found`);
      const oldEntity = { ...(await entity.get({ plain: true })) };
      const updateData = filterAvail(propNamesStall, data);
      await entity.update(updateData);
      const detail = await entity.get({ plain: true });

      ModelLogManager.log(
        querier,
        classNameStall,
        detail.id,
        oldEntity,
        detail
      );
      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async stallDelete(querier, id, stallId) {
    const { ProductCategory, Stall } = MODELS;
    const { claims } = querier;
    try {
      const entity = await Stall.findByPk(stallId, {
        include: [{ model: ProductCategory, where: { id }, required: true }],
      });
      if (!entity) throw Error(`No Data Found`);
      const oldEntity = { ...(await entity.get({ plain: true })) };
      await entity.destroy();
      const detail = await entity.get({ plain: true });

      ModelLogManager.log(
        querier,
        classNameStall,
        detail.id,
        oldEntity,
        detail
      );
      return Promise.resolve({ ok: true, detail });
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }

  static makeid(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  }
}
