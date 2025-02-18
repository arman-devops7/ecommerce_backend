import { Op } from 'sequelize';

export const Q_listoptions = (req) => {
  const { limit, offset, order } = req.query;
  const options = {};

  if (limit) options.limit = Number(limit);
  if (offset) options.offset = Number(offset);

  if (order) {
    try {
      const orderObj = JSON.parse(order);
      options.order = Array.isArray(orderObj.order) ? orderObj.order : [];
    } catch (error) {
      console.error('Invalid order format:', error.message);
      options.order = [];
    }
  }

  return options;
};

export const Q_where = (conditions, req) => {
  const { query } = req;
  const where = {};

  if (Array.isArray(conditions)) {
    console.log('Query Parameters:', query);

    for (const { field, type = '=' } of conditions) {
      const value = query[field];

      if (value !== undefined) {
        switch (type) {
          case '=':
            where[field] = value === 'null' ? null : value;
            break;

          case '!Null':
            where[field] = value === 'true'
              ? { [Op.not]: null }
              : null;
            break;

          default:
            console.warn(`Unsupported condition type: ${type}`);
            break;
        }
      }
    }
  }

  return where;
};