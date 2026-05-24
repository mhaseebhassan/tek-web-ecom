const Joi = require('joi');

exports.contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  message: Joi.string().trim().min(10).max(2000).required(),
});
