const express = require('express');
const { getCart, addToCart, clearCart } = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // All cart routes are protected

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addToCart);

module.exports = router;
