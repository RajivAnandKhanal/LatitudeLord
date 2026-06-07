const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  // Normalise Mongoose and JWT errors into ApiError
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Mongoose duplicate key
    if (err.code === 11000) {
      statusCode = 409;
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      message = `${field} already exists`;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 422;
      message = Object.values(err.errors)
        .map((e) => e.message)
        .join(', ');
    }

    // Mongoose CastError (invalid ObjectId etc.)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid value for field: ${err.path}`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }

    error = new ApiError(statusCode, message, [], err.stack);
  }

  logger.error(`[${error.statusCode}] ${error.message}`);

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = errorHandler;
