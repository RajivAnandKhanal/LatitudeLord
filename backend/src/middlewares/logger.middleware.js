const morgan = require('morgan');
const logger = require('../config/logger');

// Pipe Morgan output through Winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

const loggerMiddleware = morgan('combined', { stream });

module.exports = loggerMiddleware;
