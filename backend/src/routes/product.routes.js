const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { protect, optionalAuth, authorizeRoles } = require('../middlewares/auth.middleware');
const { cache } = require('../middlewares/cache.middleware');
const validate = require('../middlewares/validate.middleware');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');

const router = express.Router();

router.route('/')
  .get(optionalAuth, cache((req) => `products_all_${req.user?.role || 'public'}_${JSON.stringify(req.query || {})}`, 3600), getProducts)
  .post(protect, authorizeRoles('admin'), validate(createProductSchema), createProduct);

router.route('/:id')
  .get(optionalAuth, cache((req) => `product_${req.params.id}_${req.user?.role || 'public'}`, 3600), getProduct)
  .put(protect, authorizeRoles('admin'), validate(updateProductSchema), updateProduct)
  .delete(protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;
