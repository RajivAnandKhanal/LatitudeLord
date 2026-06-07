const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().max(60).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('passenger', 'driver', 'staff').default('passenger'),
  phone: Joi.string().trim().allow('', null).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('passenger', 'driver', 'staff').default('passenger'),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema, refreshTokenSchema };
