const Order = require('../models/order.model');

const orderPopulate = [
  { path: 'user', select: 'name email' },
  { path: 'items.product', select: 'name category images slug' },
];

exports.findOrders = (filter = {}) =>
  Order.find(filter).populate(orderPopulate).sort({ createdAt: -1 });

exports.findOrderById = (id) => Order.findById(id).populate(orderPopulate);

exports.createOrder = (payload) => Order.create(payload);

exports.updateOrder = (id, updates) =>
  Order.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate(orderPopulate);
