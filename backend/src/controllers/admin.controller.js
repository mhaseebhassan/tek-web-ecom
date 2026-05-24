const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const StoreSettings = require('../models/storeSettings.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'];

const serializeOrder = (order) => {
  const plain = order.toObject ? order.toObject() : order;

  return {
    id: plain._id.toString(),
    user: plain.user
      ? {
          id: plain.user._id?.toString?.() || plain.user.toString(),
          name: plain.user.name,
          email: plain.user.email,
        }
      : null,
    items: (plain.items || []).map((item) => ({
      product: item.product
        ? {
            id: item.product._id?.toString?.() || item.product.toString(),
            name: item.product.name || item.name,
            category: item.product.category,
          }
        : null,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: plain.subtotal,
    shippingFee: plain.shippingFee,
    tax: plain.tax,
    total: plain.total,
    totalAmount: plain.total,
    status: plain.orderStatus,
    paymentStatus: plain.paymentStatus,
    shippingAddress: plain.shippingAddress,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  const products = await Product.find();
  const users = await User.find({ role: 'customer' });

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  res.status(200).json({
    success: true,
    stats: {
      revenue: totalRevenue,
      orders: orders.length,
      customers: users.length,
      products: products.length,
    },
  });
});

exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name category')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders: orders.map(serializeOrder),
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const { status, paymentStatus } = req.body;
  const updates = {};

  if (status !== undefined) {
    if (!ORDER_STATUSES.includes(status)) {
      return next(new ApiError(400, 'Invalid order status'));
    }
    updates.orderStatus = status;
  }

  if (paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(paymentStatus)) {
      return next(new ApiError(400, 'Invalid payment status'));
    }
    updates.paymentStatus = paymentStatus;
  }

  const order = await Order.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('user', 'name email')
    .populate('items.product', 'name category');

  if (!order) {
    return next(new ApiError(404, 'Order not found'));
  }

  res.status(200).json({
    success: true,
    order: serializeOrder(order),
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
    orders: orders.map(serializeOrder),
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
