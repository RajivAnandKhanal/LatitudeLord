const Bus = require('../models/Bus.model');
const Route = require('../models/Route.model');
const BusLocation = require('../models/BusLocation.model');
const ApiError = require('../utils/ApiError');
const { findNearestStation } = require('../utils/geoUtils');
const { getEtaToStation } = require('../utils/etaUtils');
const { DAYS_OF_WEEK } = require('../config/constants');

// ── Helpers ────────────────────────────────────────────────────────────────────
const assertOwnsBus = async (busId, driverId) => {
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, 'Bus not found');
  if (bus.driver.toString() !== driverId.toString()) {
    throw new ApiError(403, 'You do not own this bus');
  }
  return bus;
};

/**
 * Attaches ETA-to-next-station info to a raw location doc, using today's
 * schedule if the bus has one. Returns the location untouched if there's no
 * schedule for today.
 */
const withEta = async (location) => {
  const route = await Route.findOne({ busId: location.bus });
  if (!route) return { ...location.toObject(), eta: null };

  const today = DAYS_OF_WEEK[new Date().getDay()];
  const todaySchedule = route.schedule.find((d) => d.day === today);
  if (!todaySchedule) return { ...location.toObject(), eta: null };

  const point = { lat: location.lat, lng: location.lng };
  const nearest = findNearestStation(point, todaySchedule.stations);
  const nextStation = nearest ? todaySchedule.stations[nearest.index + 1] : null;

  if (!nextStation) return { ...location.toObject(), eta: null };

  const eta = getEtaToStation(point, nextStation, location.speedKmh);

  return {
    ...location.toObject(),
    eta: { nextStation: nextStation.name, ...eta },
  };
};

// ── Service methods ────────────────────────────────────────────────────────────

/**
 * Upserts a bus's latest location. Used by both the REST ping endpoint and
 * the driver-side socket handler, so the two stay in lockstep.
 */
const updateLocation = async ({ busId, driverId, lat, lng, speedKmh, heading }) => {
  await assertOwnsBus(busId, driverId);

  const location = await BusLocation.findOneAndUpdate(
    { bus: busId },
    { lat, lng, speedKmh, heading, lastPingAt: new Date(), isOnline: true },
    { upsert: true, new: true, runValidators: true }
  );

  return withEta(location);
};

/**
 * Latest known location for a single bus. Public — no ownership check.
 */
const getLocation = async (busId) => {
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, 'Bus not found');

  const location = await BusLocation.findOne({ bus: busId });
  if (!location) throw new ApiError(404, 'No location reported for this bus yet');

  return withEta(location);
};

/**
 * Latest locations for every currently-online bus. Powers a live map view.
 */
const getAllActiveLocations = async () => {
  const locations = await BusLocation.find({ isOnline: true }).populate(
    'bus',
    'busNumber plateNumber status'
  );

  return locations;
};

/**
 * Flags buses as offline if their last ping is older than `staleAfterMs`.
 * Called by the staleLocation cron job.
 * @returns {number} count of buses marked offline
 */
const markStaleBusesOffline = async (staleAfterMs) => {
  const cutoff = new Date(Date.now() - staleAfterMs);

  const result = await BusLocation.updateMany(
    { isOnline: true, lastPingAt: { $lt: cutoff } },
    { isOnline: false }
  );

  return result.modifiedCount;
};

module.exports = {
  updateLocation,
  getLocation,
  getAllActiveLocations,
  markStaleBusesOffline,
};
