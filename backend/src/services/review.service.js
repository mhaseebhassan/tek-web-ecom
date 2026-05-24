const Review = require('../models/review.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const ApiError = require('../utils/ApiError');

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        ratingAverage: { $avg: '$rating' },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: Math.round(stats[0].ratingAverage * 10) / 10,
      ratingCount: stats[0].ratingCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { ratingAverage: 0, ratingCount: 0 });
  }
};

const serializeReview = (review) => {
  const plain = review.toObject ? review.toObject() : review;
  return {
    id: plain._id.toString(),
    rating: plain.rating,
    comment: plain.comment,
    createdAt: plain.createdAt,
    user: plain.user
      ? {
          id: plain.user._id?.toString?.() || plain.user.toString(),
          name: plain.user.name,
        }
      : null,
    product: plain.product?.toString?.() || plain.product,
  };
};

exports.listProductReviews = async (productId) => {
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  return reviews.map(serializeReview);
};

exports.createReview = async ({ userId, productId, rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }

  const hasOrder = await Order.findOne({
    user: userId,
    'items.product': productId,
    orderStatus: { $in: ['delivered', 'shipped', 'processing', 'confirmed'] },
  });

  if (!hasOrder) {
    throw new ApiError(403, 'You can only review products you have ordered');
  }

  const existing = await Review.findOne({ user: userId, product: productId });
  if (existing) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  const review = await Review.create({ user: userId, product: productId, rating, comment });
  await updateProductRating(productId);
  await review.populate('user', 'name');
  return serializeReview(review);
};

exports.updateReview = async ({ reviewId, userId, role, rating, comment }) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');
  if (role !== 'admin' && review.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to update this review');
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();
  await updateProductRating(review.product);
  await review.populate('user', 'name');
  return serializeReview(review);
};

exports.deleteReview = async ({ reviewId, userId, role }) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');
  if (role !== 'admin' && review.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRating(productId);
  return { success: true };
};
