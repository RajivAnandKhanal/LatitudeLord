const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/tokenUtils');
const logger = require('./logger');

let io = null;

/**
 * Initializes Socket.IO on top of the existing HTTP server.
 *
 * Auth: the access token is optional at the handshake level, because
 * passengers should be able to watch a bus's live position without logging
 * in (mirrors the public GET /buses REST routes). Handlers that need a
 * verified driver (e.g. emitting a location update) check `socket.user`
 * themselves and reject anonymous/non-driver sockets.
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.user = null; // anonymous — read-only access
      return next();
    }

    try {
      socket.user = verifyAccessToken(token); // { _id, role }
      next();
    } catch {
      next(new Error('Unauthorized: invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (${socket.user?.role || 'anonymous'})`);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/** Returns the initialized Socket.IO server instance. */
const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized — call initSocket(server) first');
  return io;
};

module.exports = { initSocket, getIO };
