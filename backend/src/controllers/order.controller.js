const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Notification = require('../models/notification.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');
const { getIo } = require('../sockets/socket');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private (Customer)
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod, items = [] } = req.body;

  // 1. Get user cart, or fall back to explicit checkout items from the client cart.
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  const checkoutItems =
    cart && cart.items.length > 0
      ? cart.items.map((item) => ({ product: item.product._id, quantity: item.quantity }))
      : items.map((item) => ({ product: item.product || item.productId, quantity: item.quantity }));

  if (checkoutItems.length === 0) {
    return next(new ApiError(400, 'Your cart is empty'));
  }

  // 2. Validate stock and calculate prices
  let subtotal = 0;
  const orderItems = [];

  for (const item of checkoutItems) {
    const product = await Product.findById(item.product);
    
    if (!product || !product.isActive) {
      return next(new ApiError(400, 'A product in your cart is no longer available'));
    }
    
    if (product.stock < item.quantity) {
      return next(new ApiError(400, `Not enough stock for ${product.name}`));
    }

    // Use backend price, never trust frontend
    subtotal += product.price * item.quantity;
    
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      price: product.price,
      quantity: item.quantity,
    });
  }

  const shippingFee = subtotal > 1000 ? 0 : 50; // Example flat rate
  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + shippingFee + tax;

  // 3. Create Order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    tax,
    total,
  });

  // 4. Reduce stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // 5. Clear cart
  await Cart.findOneAndDelete({ user: req.user.id });

  // 6. Create Notification for Admins
  const notification = await Notification.create({
    roleTarget: 'admin',
    type: 'new_order',
    title: 'New Order Received',
    message: `Order #${order._id} was placed by ${req.user.name}.`,
    data: { orderId: order._id, total: order.total },
  });

  // 7. Emit Socket.IO event to admin room
  try {
    const io = getIo();
    io.to('admin_room').emit('new-order', {
      message: `New order #${order._id} received!`,
      order,
      notification,
    });
  } catch (error) {
    // Orders should still succeed if Socket.IO is not initialized in a test/worker context.
  }

  res.status(201).json({
    success: true,
    order,
  });
});
