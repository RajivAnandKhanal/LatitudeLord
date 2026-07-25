const Joi = require('joi');

const startJourneySchema = Joi.object({
  busId: Joi.string().hex().length(24).required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

const snapshotSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  speedKmh: Joi.number().min(0).max(200).optional(),
});

const endJourneySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

module.exports = { startJourneySchema, snapshotSchema, endJourneySchema };
