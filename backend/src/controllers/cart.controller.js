const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');

const serializeCart = (cart) => {
  const plain = cart.toObject ? cart.toObject() : cart;
  return {
    id: plain._id.toString(),
    items: (plain.items || []).map((item) => {
      const product = item.product;
      const isPopulated = product && typeof product === 'object' && product.name;

      return {
        product: isPopulated
          ? {
              id: product._id.toString(),
              name: product.name,
              price: product.price,
              stock: product.stock,
              images: product.images,
              slug: product.slug,
            }
          : null,
        quantity: item.quantity,
      };
    }),
  };
};

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({ success: true, cart: serializeCart(cart) });
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
    const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId);

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
  res.status(200).json({ success: true, cart: serializeCart(cart) });
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return next(new ApiError(404, 'Product not found or unavailable'));
  }

  if (quantity < 1) {
    return next(new ApiError(400, 'Quantity must be at least 1'));
  }

  if (product.stock < quantity) {
    return next(new ApiError(400, 'Not enough stock'));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new ApiError(404, 'Cart not found'));

  const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId);
  if (itemIndex === -1) return next(new ApiError(404, 'Item not in cart'));

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  const populated = await Cart.findById(cart._id).populate('items.product');
  res.status(200).json({ success: true, cart: serializeCart(populated) });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new ApiError(404, 'Cart not found'));

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate('items.product');
  res.status(200).json({ success: true, cart: serializeCart(populated) });
});

exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
  });
});
