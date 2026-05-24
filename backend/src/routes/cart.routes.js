const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cart.validator');

const router = express.Router();

router.use(protect);

router.route('/').get(getCart).delete(clearCart);
router.post('/items', validate(addToCartSchema), addToCart);
router.patch('/items', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:productId', removeCartItem);

module.exports = router;
