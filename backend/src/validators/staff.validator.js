const Joi = require('joi');

const createStaffSchema = Joi.object({
  name: Joi.string().trim().max(60).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  // Compulsory per initial_system_design.txt ("Bus Staff Phone Number
  // (Compulsory) -> but not shown to user, for privacy reason"). It's never
  // exposed on any passenger-facing route, only to the owning driver here.
  phone: Joi.string().trim().required(),
});

const updateStaffSchema = Joi.object({
  name: Joi.string().trim().max(60),
  phone: Joi.string().trim(),
  avatar: Joi.string().trim().uri(),
  isActive: Joi.boolean(),
}).min(1);

module.exports = { createStaffSchema, updateStaffSchema };
