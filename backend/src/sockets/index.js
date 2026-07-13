const { initSocket } = require('../config/socket');
const { registerBusSocket } = require('./bus.socket');
const { registerLocationSocket } = require('./location.socket');
const logger = require('../config/logger');

/**
 * Boots Socket.IO on the given HTTP server and wires up all namespaces/handlers.
 * Called once from server.js after the HTTP server is created.
 */
const setupSockets = (httpServer) => {
  const io = initSocket(httpServer);

  io.on('connection', (socket) => {
    registerBusSocket(io, socket);
    registerLocationSocket(io, socket);

    socket.on('error', (err) => {
      logger.error(`Socket error (${socket.id}): ${err.message}`);
    });
  });

  return io;
};

module.exports = { setupSockets };
