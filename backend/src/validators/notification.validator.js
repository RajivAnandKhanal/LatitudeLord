const Joi = require('joi');

const registerTokenSchema = Joi.object({
  fcmToken: Joi.string().trim().min(10).required(),
});

module.exports = { registerTokenSchema };
