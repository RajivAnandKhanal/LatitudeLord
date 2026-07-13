const locationService = require('../services/location.service');
const logger = require('../config/logger');
const { broadcastLocation } = require('./location.socket');

// ── Driver-side handlers ─────────────────────────────────────────────────────
// Only authenticated drivers may push location pings. `socket.user` is set
// (or left null) by the auth middleware in config/socket.js.
const registerBusSocket = (io, socket) => {
  socket.on('location:ping', async ({ busId, lat, lng, speedKmh, heading } = {}, ack) => {
    const respond = (payload) => {
      if (typeof ack === 'function') ack(payload);
    };

    try {
      if (!socket.user || socket.user.role !== 'driver') {
        return respond({ success: false, message: 'Only drivers can send location pings' });
      }
      if (!busId || typeof lat !== 'number' || typeof lng !== 'number') {
        return respond({ success: false, message: 'busId, lat and lng are required' });
      }

      const location = await locationService.updateLocation({
        busId,
        driverId: socket.user._id,
        lat,
        lng,
        speedKmh,
        heading,
      });

      broadcastLocation(io, busId, location);
      respond({ success: true, data: location });
    } catch (err) {
      logger.error(`location:ping failed: ${err.message}`);
      respond({ success: false, message: err.message || 'Failed to update location' });
    }
  });
};

module.exports = { registerBusSocket };
