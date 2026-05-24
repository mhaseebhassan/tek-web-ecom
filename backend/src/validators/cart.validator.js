const Joi = require('joi');

exports.addToCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).max(99).required(),
});

exports.updateCartItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).max(99).required(),
});
