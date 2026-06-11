const express = require('express');
const { createOrder, getMyOrders, getOrder, cancelMyOrder, downloadInvoice } = require('../controllers/order.controller');
const { optionalAuth, protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createOrderSchema } = require('../validators/order.validator');

const router = express.Router();

router.route('/')
  .get(protect, getMyOrders)
  .post(optionalAuth, validate(createOrderSchema), createOrder);

router.route('/:id')
  .get(protect, getOrder);

router.patch('/:id/cancel', protect, cancelMyOrder);
router.get('/:id/invoice', protect, downloadInvoice);

module.exports = router;
