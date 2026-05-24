const Product = require('../models/product.model');
const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');
const { clearCache } = require('../middlewares/cache.middleware');

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeProductPayload = (body) => {
  const payload = { ...body };

  if (payload.image && !payload.images) {
    payload.images = [payload.image];
  }

  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }

  if (payload.price !== undefined) {
    payload.price = Number(payload.price);
  }

  if (payload.compareAtPrice !== undefined && payload.compareAtPrice !== '') {
    payload.compareAtPrice = Number(payload.compareAtPrice);
  }

  if (payload.stock !== undefined) {
    payload.stock = Number(payload.stock);
  }

  delete payload.image;
  return payload;
};

const serializeProduct = (product) => {
  const plain = product.toObject ? product.toObject() : product;
  const image = plain.images && plain.images.length > 0 ? plain.images[0] : '';

  return {
    ...plain,
    id: plain._id.toString(),
    image,
  };
};

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isActive: true }).select('-__v');
  
  res.status(200).json({
    success: true,
    count: products.length,
    products: products.map(serializeProduct),
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    return next(new ApiError(404, 'Product not found'));
  }

  res.status(200).json({
    success: true,
    product: serializeProduct(product),
  });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Admin)
exports.createProduct = asyncHandler(async (req, res, next) => {
  const payload = normalizeProductPayload(req.body);
  payload.createdBy = req.user.id;
  
  const product = await Product.create(payload);

  // Clear Redis cache for products list
  await clearCache('products_*');

  res.status(201).json({
    success: true,
    product: serializeProduct(product),
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    normalizeProductPayload(req.body),
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  await clearCache('products_*');
  await clearCache(`product_${req.params.id}`);

  res.status(200).json({
    success: true,
    product: serializeProduct(product),
  });
});

// @desc    Soft delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  await clearCache('products_*');
  await clearCache(`product_${req.params.id}`);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});
