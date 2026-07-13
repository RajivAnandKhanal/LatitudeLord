const logger = require('../config/logger');

const room = (busId) => `bus:${busId}`;

// ── Passenger-side handlers ──────────────────────────────────────────────────
// Anonymous sockets are allowed here — tracking a bus doesn't require login,
// same as the public GET /location/:busId REST route.
const registerLocationSocket = (io, socket) => {
  socket.on('location:subscribe', ({ busId } = {}) => {
    if (!busId) return;
    socket.join(room(busId));
  });

  socket.on('location:unsubscribe', ({ busId } = {}) => {
    if (!busId) return;
    socket.leave(room(busId));
  });
};

/** Broadcasts a location update to everyone subscribed to that bus. */
const broadcastLocation = (io, busId, location) => {
  io.to(room(busId)).emit('location:update', location);
};

module.exports = { registerLocationSocket, broadcastLocation, room };
