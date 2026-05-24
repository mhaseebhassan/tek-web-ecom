const Joi = require('joi');

const productPayload = {
  name: Joi.string().trim().min(2).max(120).required(),
  slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: Joi.string().trim().min(10).max(2000).required(),
  details: Joi.string().trim().max(3000).allow(''),
  price: Joi.number().min(0).required(),
  compareAtPrice: Joi.number().min(0).allow(null, ''),
  category: Joi.string().trim().min(2).max(80).required(),
  brand: Joi.string().trim().max(80).allow(''),
  image: Joi.string().trim().allow(''),
  images: Joi.array().items(Joi.string().trim()).max(10),
  stock: Joi.number().integer().min(0).required(),
  sku: Joi.string().trim().max(80).allow(''),
  tags: Joi.array().items(Joi.string().trim().max(80)).max(12),
  isFeatured: Joi.boolean(),
  isActive: Joi.boolean(),
};

exports.createProductSchema = Joi.object(productPayload);
exports.updateProductSchema = Joi.object({
  ...productPayload,
  name: productPayload.name.optional(),
  description: productPayload.description.optional(),
  price: productPayload.price.optional(),
  category: productPayload.category.optional(),
  stock: productPayload.stock.optional(),
}).min(1);
