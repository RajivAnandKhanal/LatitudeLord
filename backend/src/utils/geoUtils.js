// ── Geo helpers ───────────────────────────────────────────────────────────────
// Pure functions — no Express/Mongoose dependencies.

const EARTH_RADIUS_KM = 6371;

const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Haversine great-circle distance between two lat/lng points.
 * @returns {number} distance in kilometers
 */
const getDistanceKm = (from, to) => {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

/**
 * Initial compass bearing (0-360, 0 = North) from one point to another.
 */
const getBearing = (from, to) => {
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

/**
 * Finds the station in a list closest to a given point.
 * @param {{lat:number,lng:number}} point
 * @param {Array<{name:string,lat:number,lng:number}>} stations
 * @returns {{ station: object, index: number, distanceKm: number } | null}
 */
const findNearestStation = (point, stations = []) => {
  if (!stations.length) return null;

  let best = null;
  stations.forEach((station, index) => {
    const distanceKm = getDistanceKm(point, station);
    if (!best || distanceKm < best.distanceKm) {
      best = { station, index, distanceKm };
    }
  });

  return best;
};

module.exports = { getDistanceKm, getBearing, findNearestStation };
