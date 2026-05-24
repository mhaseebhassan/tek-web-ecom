const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');
const { cache } = require('../middlewares/cache.middleware');

const router = express.Router();

router.route('/')
  .get(cache('products_all', 3600), getProducts)
  .post(protect, authorizeRoles('admin'), createProduct);

router.route('/:id')
  .get(cache((req) => `product_${req.params.id}`, 3600), getProduct)
  .put(protect, authorizeRoles('admin'), updateProduct)
  .delete(protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;
