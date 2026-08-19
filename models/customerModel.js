const { all, get, run } = require('../db');

module.exports = {
  getAll: async () => {
    return await all('SELECT id, name, email FROM customers ORDER BY id ASC');
  },

  add: async (customer) => {
    const result = await run(
      'INSERT INTO customers (name, email) VALUES (?, ?)',
      [customer.name, customer.email]
    );

    return {
      id: result.lastID,
      name: customer.name,
      email: customer.email,
    };
  },

  findById: async (id) => {
    return await get('SELECT id, name, email FROM customers WHERE id = ?', [id]);
  },
};
