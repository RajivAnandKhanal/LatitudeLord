const logger = require('../config/logger');

// ── ML service client ────────────────────────────────────────────────────────
// Thin client for the external ETA-prediction service. Every function here
// is designed to fail soft: if ML_SERVICE_URL isn't configured, the request
// times out, or the service errors, callers get `null`/`false` back instead
// of an exception — GPS-only estimates (etaUtils.js) remain the fallback.

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;
const REQUEST_TIMEOUT_MS = 2000; // sits on the GET /location hot path — fail fast

const isConfigured = () => Boolean(ML_SERVICE_URL);

const withTimeout = async (fn) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Asks the external ML service for a smarter ETA prediction based on
 * historical journey data for this bus. Never throws.
 *
 * @returns {Promise<number|null>} predicted ETA in minutes, or null if
 *   unavailable/unconfigured/errored — caller should fall back to haversine.
 */
const getEnhancedEta = async ({ busId, currentPoint, targetStation, speedKmh }) => {
  if (!isConfigured()) return null;

  try {
    const res = await withTimeout((signal) =>
      fetch(`${ML_SERVICE_URL}/predict-eta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId, currentPoint, targetStation, speedKmh }),
        signal,
      })
    );

    if (!res.ok) return null;

    const data = await res.json();
    return typeof data.etaMinutes === 'number' ? data.etaMinutes : null;
  } catch (err) {
    logger.warn(`ML ETA request failed, falling back to GPS estimate: ${err.message}`);
    return null;
  }
};

/**
 * Ships a batch of completed journeys to the ML service for training.
 * Called nightly by jobs/mlDataExport.job.js.
 *
 * @returns {Promise<boolean>} true if the service accepted the batch
 */
const exportJourneys = async (journeys) => {
  if (!isConfigured()) return false;

  try {
    const res = await withTimeout((signal) =>
      fetch(`${ML_SERVICE_URL}/journeys/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeys }),
        signal,
      })
    );

    return res.ok;
  } catch (err) {
    logger.warn(`ML journey export failed: ${err.message}`);
    return false;
  }
};

module.exports = { isConfigured, getEnhancedEta, exportJourneys };
