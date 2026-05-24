const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');

exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return next(new ApiError(404, 'Product not found or unavailable'));
  }

  if (product.stock < quantity) {
    return next(new ApiError(400, 'Not enough stock'));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      if (product.stock < cart.items[itemIndex].quantity) {
        return next(new ApiError(400, 'Not enough stock to add more'));
      }
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  }

  cart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  
  res.status(200).json({
    success: true,
    message: 'Cart cleared',
  });
});
