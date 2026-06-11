const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Notification = require('../models/notification.model');
const orderRepository = require('../repositories/order.repository');
const ApiError = require('../utils/ApiError');
const { clearCache } = require('../middlewares/cache.middleware');
const { getIo } = require('../sockets/socket');

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
    guestCustomer: plain.guestCustomer || null,
    items: (plain.items || []).map((item) => ({
      product: item.product
        ? {
            id: item.product._id?.toString?.() || item.product.toString(),
            name: item.product.name || item.name,
            category: item.product.category,
            slug: item.product.slug,
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

const emitIfReady = (room, event, payload) => {
  try {
    getIo().to(room).emit(event, payload);
  } catch (error) {
    // Socket.IO is optional during scripts/tests.
  }
};

exports.createOrder = async ({ user, body }) => {
  const { shippingAddress, paymentMethod, items = [], name, email } = body;
  const customerName = user?.name || name?.trim();
  const customerEmail = user?.email || email?.trim();

  if (!user && (!customerName || !customerEmail)) {
    throw new ApiError(400, 'Name and email are required for guest checkout');
  }

  const cart = user ? await Cart.findOne({ user: user.id }).populate('items.product') : null;
  const checkoutItems =
    cart && cart.items.length > 0
      ? cart.items.map((item) => ({ product: item.product?._id, quantity: item.quantity }))
      : items.map((item) => ({ product: item.product || item.productId, quantity: item.quantity }));

  if (checkoutItems.length === 0) {
    throw new ApiError(400, 'Your cart is empty');
  }

  let subtotal = 0;
  const orderItems = [];
  const lowStockProducts = [];
  const reservedItems = [];
  let order;

  try {
    for (const item of checkoutItems) {
      if (!item.product) {
        throw new ApiError(400, 'A product in your cart is no longer available');
      }

      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        throw new ApiError(400, 'A product in your cart is no longer available');
      }

      const updated = await Product.findOneAndUpdate(
        { _id: product._id, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        throw new ApiError(400, `Not enough stock for ${product.name}`);
      }

      reservedItems.push({ product: product._id, quantity: item.quantity });
      if (updated.stock <= 5) {
        lowStockProducts.push(updated);
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        price: product.price,
        quantity: item.quantity,
      });
    }

    const shippingFee = subtotal > 1000 ? 0 : 50;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + shippingFee + tax;

    order = await orderRepository.createOrder({
      user: user?.id,
      guestCustomer: user
        ? undefined
        : {
            name: customerName,
            email: customerEmail,
          },
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      total,
    });
  } catch (error) {
    await Promise.all(
      reservedItems.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
      )
    );
    throw error;
  }

  if (user) {
    await Cart.findOneAndDelete({ user: user.id });
  }
  await clearCache('admin_dashboard_stats');
  await clearCache('products_*');

  const notification = await Notification.create({
    roleTarget: 'admin',
    type: 'new_order',
    title: 'New Order Received',
    message: `Order #${order._id} was placed by ${customerName}.`,
    data: { orderId: order._id, total: order.total },
  });

  emitIfReady('admin_room', 'new-order', {
    message: `New order #${order._id} received!`,
    order: serializeOrder(order),
    notification,
  });

  lowStockProducts.forEach((product) => {
    emitIfReady('admin_room', 'low-stock-alert', {
      productId: product._id,
      name: product.name,
      stock: product.stock,
    });
  });

  return serializeOrder(order);
};

exports.listOrders = async (filter = {}) => {
  const orders = await orderRepository.findOrders(filter);
  return orders.map(serializeOrder);
};

exports.getOrderForUser = async ({ orderId, user }) => {
  const order = await orderRepository.findOrderById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  if (user.role !== 'admin' && order.user?._id?.toString() !== user.id.toString()) {
    throw new ApiError(403, 'You are not authorized to view this order');
  }

  return serializeOrder(order);
};

exports.updateOrderStatus = async ({ orderId, status, paymentStatus }) => {
  const updates = {};
  let previousOrder = null;

  if (status !== undefined) {
    if (!ORDER_STATUSES.includes(status)) throw new ApiError(400, 'Invalid order status');
    if (status === 'cancelled') {
      previousOrder = await orderRepository.findOrderById(orderId);
      if (!previousOrder) throw new ApiError(404, 'Order not found');
    }
    updates.orderStatus = status;
  }

  if (paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(paymentStatus)) throw new ApiError(400, 'Invalid payment status');
    updates.paymentStatus = paymentStatus;
  }

  const order = await orderRepository.updateOrder(orderId, updates);
  if (!order) throw new ApiError(404, 'Order not found');

  if (status === 'cancelled' && previousOrder.orderStatus !== 'cancelled') {
    await Promise.all(
      previousOrder.items
        .map((item) => ({ productId: item.product?._id || item.product, quantity: item.quantity }))
        .filter((item) => item.productId)
        .map((item) => Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }))
    );
    await clearCache('products_*');
  }

  await clearCache('admin_dashboard_stats');

  const serialized = serializeOrder(order);
  if (order.user?._id) {
    emitIfReady(`user:${order.user._id}`, 'order-status-updated', {
      message: `Order #${order._id} status updated to ${serialized.status}.`,
      order: serialized,
    });
  }

  return serialized;
};

exports.cancelOrder = async ({ orderId, user }) => {
  const order = await orderRepository.findOrderById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user?._id?.toString() !== user.id.toString()) {
    throw new ApiError(403, 'You are not authorized to cancel this order');
  }
  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    throw new ApiError(400, 'Only pending or confirmed orders can be cancelled');
  }

  return exports.updateOrderStatus({ orderId, status: 'cancelled' });
};

exports.serializeOrder = serializeOrder;
