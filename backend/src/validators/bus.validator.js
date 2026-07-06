const Joi = require('joi');

const createBusSchema = Joi.object({
  busNumber: Joi.string().trim().uppercase().max(20).required(),
  plateNumber: Joi.string().trim().uppercase().max(20).required(),
  capacity: Joi.number().integer().min(1).optional(),
});

const updateBusSchema = Joi.object({
  busNumber: Joi.string().trim().uppercase().max(20),
  plateNumber: Joi.string().trim().uppercase().max(20),
  capacity: Joi.number().integer().min(1),
  status: Joi.string().valid('active', 'maintenance', 'inactive'),
}).min(1);

module.exports = { createBusSchema, updateBusSchema };
