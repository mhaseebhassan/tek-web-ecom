const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().trim().max(30).allow(''),
  avatar: Joi.string().trim().max(500).allow(''),
  address: Joi.object({
    street: Joi.string().trim().max(200),
    city: Joi.string().trim().max(100),
    state: Joi.string().trim().max(100),
    zipCode: Joi.string().trim().max(20),
    country: Joi.string().trim().max(100),
  }),
});
