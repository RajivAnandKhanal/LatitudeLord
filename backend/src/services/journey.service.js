const Journey = require('../models/Journey.model');
const Bus = require('../models/Bus.model');
const ApiError = require('../utils/ApiError');
const { getDistanceKm } = require('../utils/geoUtils');
const { getPagination, buildPaginatedResult } = require('../utils/pagination');

/**
 * Opens a new journey for a passenger boarding a bus. A passenger can only
 * have one ongoing journey at a time — you can't board two buses at once.
 */
const startJourney = async ({ userId, busId, lat, lng }) => {
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, 'Bus not found');

  const existing = await Journey.findOne({ user: userId, status: 'ongoing' });
  if (existing) throw new ApiError(409, 'You already have a journey in progress');

  const journey = await Journey.create({
    user: userId,
    bus: busId,
    startLocation: { lat, lng },
    snapshots: [{ lat, lng, recordedAt: new Date() }],
  });

  return journey;
};

/**
 * Appends a GPS snapshot to an ongoing journey. Called periodically by the
 * passenger's app while they're aboard, feeding the ML training data.
 */
const addSnapshot = async ({ journeyId, userId, lat, lng, speedKmh }) => {
  const journey = await Journey.findById(journeyId);
  if (!journey) throw new ApiError(404, 'Journey not found');
  if (journey.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'This is not your journey');
  }
  if (journey.status !== 'ongoing') {
    throw new ApiError(409, 'Journey has already ended');
  }

  journey.snapshots.push({ lat, lng, speedKmh, recordedAt: new Date() });
  await journey.save();

  return journey;
};

/**
 * Closes an ongoing journey — records the disembark point, and computes
 * duration + distance travelled (summed leg-by-leg across snapshots, which
 * tracks a winding bus route more accurately than a straight start→end line).
 */
const endJourney = async ({ journeyId, userId, lat, lng }) => {
  const journey = await Journey.findById(journeyId);
  if (!journey) throw new ApiError(404, 'Journey not found');
  if (journey.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'This is not your journey');
  }
  if (journey.status !== 'ongoing') {
    throw new ApiError(409, 'Journey has already ended');
  }

  journey.snapshots.push({ lat, lng, recordedAt: new Date() });
  journey.endLocation = { lat, lng };
  journey.endedAt = new Date();
  journey.status = 'completed';
  journey.durationMinutes = Math.round((journey.endedAt - journey.startedAt) / 60000);

  let distanceKm = 0;
  for (let i = 1; i < journey.snapshots.length; i += 1) {
    distanceKm += getDistanceKm(journey.snapshots[i - 1], journey.snapshots[i]);
  }
  journey.distanceKm = Number(distanceKm.toFixed(3));

  await journey.save();

  return journey;
};

/**
 * Cancels an ongoing journey without recording it as a completed trip
 * (e.g. passenger boarded by mistake and got off immediately).
 */
const cancelJourney = async ({ journeyId, userId }) => {
  const journey = await Journey.findById(journeyId);
  if (!journey) throw new ApiError(404, 'Journey not found');
  if (journey.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'This is not your journey');
  }
  if (journey.status !== 'ongoing') {
    throw new ApiError(409, 'Journey has already ended');
  }

  journey.status = 'cancelled';
  journey.endedAt = new Date();
  await journey.save();

  return journey;
};

/** The passenger's current in-progress journey, if any. */
const getActiveJourney = async (userId) => {
  return Journey.findOne({ user: userId, status: 'ongoing' }).populate(
    'bus',
    'busNumber plateNumber'
  );
};

/** Paginated (completed/cancelled) journey history for a passenger. */
const getMyJourneys = async (userId, query = {}) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId, status: { $ne: 'ongoing' } };

  const [journeys, total] = await Promise.all([
    Journey.find(filter)
      .populate('bus', 'busNumber plateNumber')
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit),
    Journey.countDocuments(filter),
  ]);

  return buildPaginatedResult(journeys, total, { page, limit });
};

module.exports = {
  startJourney,
  addSnapshot,
  endJourney,
  cancelJourney,
  getActiveJourney,
  getMyJourneys,
};
