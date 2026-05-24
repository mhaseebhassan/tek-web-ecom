const express = require('express');
const {
  getProductReviews,
  createProductReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createReviewSchema, updateReviewSchema } = require('../validators/review.validator');

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, validate(createReviewSchema), createProductReview);
router.patch('/:id', protect, validate(updateReviewSchema), updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
