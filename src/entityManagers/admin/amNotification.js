import {
  MODELS,
  getNewConnection,
  releaseConnection,
} from '../../sequelize.js';
import Sequelize from 'sequelize';
import { ModelLogManager } from '../ModelLogHelper.js';
const className = 'Notification';
export class AMNotification {
  static async list(querier, where, options = {}) {
    const { Notification } = MODELS;
    try {
      const list = await Notification.findAll({
        where,
        ...options,
        order: [['id', 'DESC']],
        raw: true,
      });
      return { ok: true, list };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async get(querier, id) {
    const { Notification } = MODELS;
    try {
      const detail = await Notification.findByPk(id, { raw: true });
      if (!detail) throw Error(`No Data Found`);
      return { ok: true, detail };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async add(querier, data) {
    const { Notification } = MODELS;
    try {
      const entity = await Notification.create(data);
      const detail = await entity.get({ plain: true });
      ModelLogManager.log(querier, className, detail.id, {}, detail);
      return { ok: true, detail };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }
  static async update(querier, id, data) {
    const { Notification } = MODELS;
    try {
      const entity = await Notification.findByPk(id);
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
}
