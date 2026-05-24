const asyncHandler = require('../middlewares/async.middleware');
const reviewService = require('../services/review.service');

exports.getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.listProductReviews(req.params.productId);
  res.status(200).json({ success: true, reviews });
});

exports.createProductReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview({
    userId: req.user.id,
    productId: req.params.productId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(201).json({ success: true, review });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview({
    reviewId: req.params.id,
    userId: req.user.id,
    role: req.user.role,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(200).json({ success: true, review });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview({
    reviewId: req.params.id,
    userId: req.user.id,
    role: req.user.role,
  });

  res.status(200).json({ success: true, message: 'Review deleted' });
});
