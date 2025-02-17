import {
  MODELS,
  getNewConnection,
  releaseConnection,
} from '../../sequelize.js';
import { filterAvail } from '../../helper/entityhelper.js';
import { ModelLogManager } from '../ModelLogHelper.js';
import { CMHelper } from './cmHelper.js';

const className = 'Product';
const propNames = [
  'name',
  'shortName',
  'desc',
  'model',
  'productCategoryId',
  'productTypeId',
];

const classNameProductUom = 'ProductUom';
const propNamesProductUom = ['name', 'basePrice', 'uomUnitId'];

const classNameProductPart = 'ProductPart';
const propNamesProductPart = [
  'partName',
  'shortName',
  'requiredQty',
  'availableQty',
  'basePrice',
];

export class CMProduct extends CMHelper {
  static async list(querier, where, options = {}) {
    const { claims } = querier;
    const { Product } = MODELS;
    const include = [];

    try {
      const list = await Product.findAll({
        where,
        ...options,
        include,
      });
      return { ok: true, list };
    } catch (error) {
      console.log('error', error);
      return Promise.resolve({ ok: false, error });
    }
  }
  static async get(querier, id) {
    const { Product } = MODELS;
    const { claims } = querier;
    const include = [];

    try {
      const entity = await Product.findByPk(id, {
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
    const { Product } = MODELS;
    try {
      const updateData = filterAvail(propNames, data);
      const e = await Product.create(updateData);
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
    const { Product } = MODELS;
    const { claims } = querier;
    const include = [];
    try {
      const entity = await Product.findByPk(id, { include });
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
}
