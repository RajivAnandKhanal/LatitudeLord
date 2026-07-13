const Joi = require('joi');

const updateLocationSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  speedKmh: Joi.number().min(0).max(200).optional(),
  heading: Joi.number().min(0).max(360).optional(),
});

module.exports = { updateLocationSchema };
