const { all, run } = require('../db');

module.exports = {
  getAll: async () => {
    return await all('SELECT id, customerId, title, status FROM tickets ORDER BY id ASC');
  },

  add: async (ticket) => {
    const result = await run(
      'INSERT INTO tickets (customerId, title, status) VALUES (?, ?, ?)',
      [ticket.customerId, ticket.title, ticket.status]
    );

    return {
      id: result.lastID,
      customerId: ticket.customerId,
      title: ticket.title,
      status: ticket.status,
    };
  },
};
