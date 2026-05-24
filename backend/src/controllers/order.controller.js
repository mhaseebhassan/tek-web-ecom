const asyncHandler = require('../middlewares/async.middleware');
const orderService = require('../services/order.service');

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
