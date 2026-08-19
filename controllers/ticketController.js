const ticketModel = require('../models/ticketModel');

exports.createTicket = async (req, res) => {
  const newTicket = await ticketModel.add(req.body);
  res.json({ message: 'Ticket submitted', ticket: newTicket });
};

exports.getTickets = async (req, res) => {
  const tickets = await ticketModel.getAll();
  res.json(tickets);
};
