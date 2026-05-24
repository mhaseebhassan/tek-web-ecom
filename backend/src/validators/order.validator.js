const Joi = require('joi');

const shippingAddress = Joi.object({
  street: Joi.string().trim().min(3).max(200).required(),
  city: Joi.string().trim().min(2).max(100).required(),
  state: Joi.string().trim().min(2).max(100).required(),
  zipCode: Joi.string().trim().min(3).max(20).required(),
  country: Joi.string().trim().min(2).max(100).required(),
}).required();

exports.createOrderSchema = Joi.object({
  shippingAddress,
  paymentMethod: Joi.string().trim().max(80).default('Credit Card'),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().hex().length(24),
        productId: Joi.string().hex().length(24),
        quantity: Joi.number().integer().min(1).max(99).required(),
      }).or('product', 'productId')
    )
    .default([]),
  email: Joi.string().email(),
  name: Joi.string().trim().max(120),
});
