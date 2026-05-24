const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const StoreSettings = require('../models/storeSettings.model');
const asyncHandler = require('../middlewares/async.middleware');
const { clearCache } = require('../middlewares/cache.middleware');
const orderService = require('../services/order.service');

exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  const products = await Product.find();
  const users = await User.find({ role: 'customer' });
  const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true })
    .select('name stock slug')
    .limit(10);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  res.status(200).json({
    success: true,
    stats: {
      revenue: totalRevenue,
      orders: orders.length,
      customers: users.length,
      products: products.length,
      lowStock: lowStockProducts.length,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        stock: p.stock,
        slug: p.slug,
      })),
    },
  });
});

exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderService.listOrders();

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const { status, paymentStatus } = req.body;
  const order = await orderService.updateOrderStatus({ orderId: req.params.id, status, paymentStatus });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getCustomers = asyncHandler(async (req, res, next) => {
  const customers = await User.find({ role: 'customer' }).select('name email createdAt');
  const customerIds = customers.map((customer) => customer._id);
  const orders = await Order.find({ user: { $in: customerIds } }).select('user total createdAt');

  const ordersByCustomer = orders.reduce((acc, order) => {
    const key = order.user.toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      id: order._id.toString(),
      totalAmount: order.total,
      createdAt: order.createdAt,
    });
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    customers: customers.map((customer) => ({
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt,
      orders: ordersByCustomer[customer._id.toString()] || [],
    })),
  });
});

exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 29);

  const orders = await Order.find({ createdAt: { $gte: startDate } })
    .populate('items.product', 'name category')
    .sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    orders: orders.map(orderService.serializeOrder),
  });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    profile: {
      name: req.user.name,
      image: req.user.avatar || '',
      email: req.user.email,
    },
  });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, image } = req.body;
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (image !== undefined) updates.avatar = image;

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    profile: {
      name: user.name,
      image: user.avatar || '',
      email: user.email,
    },
  });
});

exports.getStoreSettings = asyncHandler(async (req, res, next) => {
  const settings = await StoreSettings.findOneAndUpdate(
    {},
    { $setOnInsert: {} },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    success: true,
    settings,
  });
});

exports.updateStoreSettings = asyncHandler(async (req, res, next) => {
  const numericFields = ['taxRate', 'shippingFlatRate', 'freeShippingThreshold'];
  const payload = { ...req.body };

  numericFields.forEach((field) => {
    if (payload[field] !== undefined) {
      payload[field] = Number(payload[field]);
    }
  });

  const settings = await StoreSettings.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

  res.status(200).json({
    success: true,
    settings,
  });
});
