const Joi = require('joi');

// Covers both passenger (User) and driver/staff (Driver) profile fields.
// Unknown keys are stripped by the `validate` middleware, so a passenger
// sending `licenseNumber` (or a driver sending `gender`) is simply ignored
// rather than rejected — the controller only persists fields that exist on
// the caller's own model.
const updateProfileSchema = Joi.object({
  name: Joi.string().trim().max(60),
  phone: Joi.string().trim().allow('', null),
  avatar: Joi.string().trim().allow('', null),
  gender: Joi.string().trim().allow('', null),
  healthCondition: Joi.string().trim().allow('', null),
  licenseNumber: Joi.string().trim().allow('', null),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = { updateProfileSchema, changePasswordSchema };
