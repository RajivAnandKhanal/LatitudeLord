const ApiError = require('../utils/ApiError');

/**
 * Returns a middleware that validates req.body against a Joi schema.
 *
 * @param {import('joi').Schema} schema
 */
const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,  // collect all errors
    stripUnknown: true, // remove unknown keys
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return next(new ApiError(422, 'Validation failed', errors));
  }

  // Replace body with the sanitised value (e.g. trimmed strings, defaults applied)
  req.body = value;
  next();
};

module.exports = { validate };
