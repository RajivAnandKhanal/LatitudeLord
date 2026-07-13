const cron = require('node-cron');
const logger = require('../config/logger');
const locationService = require('../services/location.service');
const { LOCATION_STALE_MS, LOCATION_SWEEP_CRON } = require('../config/constants');

/**
 * Periodically sweeps BusLocation documents and flips `isOnline` to false
 * for any bus whose last ping is older than LOCATION_STALE_MS. This keeps
 * GET /location (all active) and the live map accurate even if a driver's
 * app crashes or loses connectivity without a clean disconnect.
 */
const startStaleLocationJob = () => {
  cron.schedule(LOCATION_SWEEP_CRON, async () => {
    try {
      const count = await locationService.markStaleBusesOffline(LOCATION_STALE_MS);
      if (count > 0) {
        logger.info(`Stale-location sweep: marked ${count} bus(es) offline`);
      }
    } catch (err) {
      logger.error(`Stale-location sweep failed: ${err.message}`);
    }
  });

  logger.info(`Stale-location job scheduled (${LOCATION_SWEEP_CRON})`);
};

module.exports = { startStaleLocationJob };
