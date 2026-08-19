const { all, get, run } = require('../db');

module.exports = {
  getAll: async () => {
    return await all('SELECT id, customerId, total, status FROM orders ORDER BY id ASC');
  },

  add: async (order) => {
    const result = await run(
      'INSERT INTO orders (customerId, total, status) VALUES (?, ?, ?)',
      [order.customerId, order.total, order.status]
    );

    return {
      id: result.lastID,
      customerId: order.customerId,
      total: order.total,
      status: order.status,
    };
  },

  findById: async (id) => {
    return await get('SELECT id, customerId, total, status FROM orders WHERE id = ?', [id]);
  },
};
