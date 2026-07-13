// ── ETA helpers ───────────────────────────────────────────────────────────────
// Pure functions — no Express/Mongoose dependencies.

const { getDistanceKm } = require('./geoUtils');

const DEFAULT_SPEED_KMH = 20; // fallback average bus speed when device reports 0/no speed
const MIN_SPEED_KMH = 3; // floor to avoid divide-by-near-zero giving absurd ETAs

/**
 * Estimated minutes to cover a straight-line distance at a given speed.
 * @param {number} distanceKm
 * @param {number} speedKmh
 * @returns {number} minutes, rounded up
 */
const estimateMinutes = (distanceKm, speedKmh) => {
  const speed = Math.max(speedKmh || DEFAULT_SPEED_KMH, MIN_SPEED_KMH);
  return Math.ceil((distanceKm / speed) * 60);
};

/**
 * Estimated arrival time (ETA) for a bus's current position to reach a target station.
 * @param {{lat:number,lng:number}} currentPoint
 * @param {{lat:number,lng:number}} targetStation
 * @param {number} [speedKmh] - bus's last-known speed in km/h
 * @returns {{ distanceKm: number, etaMinutes: number, etaAt: Date }}
 */
const getEtaToStation = (currentPoint, targetStation, speedKmh) => {
  const distanceKm = getDistanceKm(currentPoint, targetStation);
  const etaMinutes = estimateMinutes(distanceKm, speedKmh);
  const etaAt = new Date(Date.now() + etaMinutes * 60 * 1000);

  return { distanceKm: Number(distanceKm.toFixed(3)), etaMinutes, etaAt };
};

module.exports = { estimateMinutes, getEtaToStation, DEFAULT_SPEED_KMH };
