const Joi = require('joi');

exports.createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).allow(''),
});

exports.updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().trim().max(1000).allow(''),
}).min(1);
