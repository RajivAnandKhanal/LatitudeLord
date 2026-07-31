const Joi = require('joi');

const submitFeedbackSchema = Joi.object({
  message: Joi.string().trim().min(3).max(1000).required(),
});

module.exports = { submitFeedbackSchema };
