const orderModel = require('../models/orderModel');

exports.getOrders = async (req, res) => {
  const orders = await orderModel.getAll();
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  const newOrder = await orderModel.add(req.body);
  res.json({ message: 'Order created', order: newOrder });
};

exports.getOrder = async (req, res) => {
  const order = await orderModel.findById(Number(req.params.id));
  res.json(order || { message: 'Order not found' });
};
