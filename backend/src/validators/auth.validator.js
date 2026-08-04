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
  // Bus staff are not issued login credentials — only drivers (and
  // passengers) can sign in. See staff.validator.js / staff.controller.js.
  role: Joi.string().valid('passenger', 'driver').default('passenger'),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  code: Joi.string().length(6).pattern(/^\d+$/).required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
