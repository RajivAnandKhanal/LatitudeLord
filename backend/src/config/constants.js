module.exports = {
  ROLES: {
    PASSENGER: 'passenger',
    DRIVER: 'driver',
    STAFF: 'staff',
  },

  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
  },

  BCRYPT_ROUNDS: 12,

  // A bus is considered offline if no location ping has arrived in this long.
  LOCATION_STALE_MS: 60 * 1000, // 60s
  // How often the stale-location sweep job runs.
  LOCATION_SWEEP_CRON: '*/30 * * * * *', // every 30s

  DAYS_OF_WEEK: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};
