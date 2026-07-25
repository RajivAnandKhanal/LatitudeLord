const Joi = require('joi');

const sendMessageSchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
});

module.exports = { sendMessageSchema };
