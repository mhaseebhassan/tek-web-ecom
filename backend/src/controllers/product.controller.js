const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');
const productService = require('../services/product.service');
const { clearCache } = require('../middlewares/cache.middleware');

const getAvailabilityStatus = (stock) => {
  if (stock <= 0) return 'out';
  if (stock <= 5) return 'low';
  return 'in';
};

const serializeProduct = (product, isAdmin = false) => {
  const data = typeof product.toObject === 'function' ? product.toObject({ virtuals: true }) : { ...product };

  if (isAdmin) {
    return data;
  }

  const { stock, createdBy, ...publicProduct } = data;
  return {
    ...publicProduct,
    availabilityStatus: getAvailabilityStatus(stock),
  };
};

exports.getProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.listProducts(req.query);
  const isAdmin = req.user?.role === 'admin';

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    products: products.map((product) => serializeProduct(product, isAdmin)),
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.getProduct(req.params.id);

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  res.status(200).json({
    success: true,
    product: serializeProduct(product, req.user?.role === 'admin'),
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.id);

  await clearCache('products_*');
  await clearCache('admin_dashboard_stats');

  res.status(201).json({
    success: true,
    product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  await clearCache('products_*');
  await clearCache(`product_${req.params.id}`);
  await clearCache('admin_dashboard_stats');

  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.deleteProduct(req.params.id);

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  await clearCache('products_*');
  await clearCache(`product_${req.params.id}`);
  await clearCache('admin_dashboard_stats');

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});
