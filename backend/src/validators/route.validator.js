const Joi = require('joi');
const { DAYS_OF_WEEK } = require('../config/constants');

const stationSchema = Joi.object({
  name: Joi.string().trim().max(80).required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

const daySchema = Joi.object({
  day: Joi.string()
    .valid(...DAYS_OF_WEEK)
    .required(),
  stations: Joi.array().items(stationSchema).min(2).required(),
});

// Full weekly schedule — used to create or replace a bus's route in one shot.
const setScheduleSchema = Joi.object({
  schedule: Joi.array()
    .items(daySchema)
    .min(1)
    .max(7)
    .unique((a, b) => a.day === b.day) // no duplicate days in one schedule
    .required(),
});

module.exports = { setScheduleSchema };
