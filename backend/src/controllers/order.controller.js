const asyncHandler = require('../middlewares/async.middleware');
const orderService = require('../services/order.service');
const path = require('path');
const fs = require('fs');

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder({ user: req.user, body: req.body });

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderForUser({ orderId: req.params.id, user: req.user });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder({ orderId: req.params.id, user: req.user });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.downloadInvoice = asyncHandler(async (req, res) => {
  // Verify ownership first
  await orderService.getOrderForUser({ orderId: req.params.id, user: req.user });

  const invoicePath = path.join(__dirname, '../../uploads/invoices', `invoice_${req.params.id}.pdf`);
  
  if (!fs.existsSync(invoicePath)) {
    return res.status(404).json({ success: false, message: 'Invoice is still generating or not found' });
  }

  res.download(invoicePath);
});
