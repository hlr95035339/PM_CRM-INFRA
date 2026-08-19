const customerModel = require('../models/customerModel');

exports.getCustomers = async (req, res) => {
  const customers = await customerModel.getAll();
  res.json(customers);
};

exports.addCustomer = async (req, res) => {
  const newCustomer = await customerModel.add(req.body);
  res.json({ message: 'Customer added', customer: newCustomer });
};
