const Redis = require('ioredis');
const logger = require('./logger');

// ── Redis client ──────────────────────────────────────────────────────────────
// Optional: Redis speeds up location lookups and (later) lets Socket.IO scale
// across multiple server instances via its pub/sub adapter. If REDIS_URL isn't
// configured, the app should still boot fine — features that need Redis just
// fall back to hitting MongoDB directly.

let client = null;

if (process.env.REDIS_URL) {
  client = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  });

  client.on('connect', () => logger.info('Redis connected'));
  client.on('error', (err) => logger.error(`Redis error: ${err.message}`));

  client.connect().catch((err) => {
    logger.error(`Redis connection failed, continuing without cache: ${err.message}`);
  });
} else {
  logger.info('REDIS_URL not set — running without Redis (locations served from MongoDB only)');
}

/** True if a live, ready Redis connection is available right now. */
const isRedisReady = () => Boolean(client && client.status === 'ready');

module.exports = { client, isRedisReady };
