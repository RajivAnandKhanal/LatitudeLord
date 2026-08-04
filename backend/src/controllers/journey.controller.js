const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const journeyService = require('../services/journey.service');

// ── POST /api/v1/journeys/start ─────────────────────────────────────────────────
// Passenger boards a bus — opens a new journey document.
const startJourney = asyncHandler(async (req, res) => {
  const { busId, lat, lng } = req.body;
  const journey = await journeyService.startJourney({ userId: req.user._id, busId, lat, lng });

  return res.status(201).json(new ApiResponse(201, journey, 'Journey started'));
});

// ── POST /api/v1/journeys/:id/snapshot ──────────────────────────────────────────
// Passenger's app periodically reports its GPS position while aboard.
const addSnapshot = asyncHandler(async (req, res) => {
  const { lat, lng, speedKmh } = req.body;
  const journey = await journeyService.addSnapshot({
    journeyId: req.params.id,
    userId: req.user._id,
    lat,
    lng,
    speedKmh,
  });

  return res.status(200).json(new ApiResponse(200, journey, 'Snapshot recorded'));
});

// ── POST /api/v1/journeys/:id/end ───────────────────────────────────────────────
// Passenger disembarks — closes the journey and computes duration/distance.
const endJourney = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  const journey = await journeyService.endJourney({
    journeyId: req.params.id,
    userId: req.user._id,
    lat,
    lng,
  });

  return res.status(200).json(new ApiResponse(200, journey, 'Journey ended'));
});

// ── POST /api/v1/journeys/:id/cancel ────────────────────────────────────────────
const cancelJourney = asyncHandler(async (req, res) => {
  const journey = await journeyService.cancelJourney({
    journeyId: req.params.id,
    userId: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, journey, 'Journey cancelled'));
});

// ── GET /api/v1/journeys/active ─────────────────────────────────────────────────
const getActiveJourney = asyncHandler(async (req, res) => {
  const journey = await journeyService.getActiveJourney(req.user._id);

  return res.status(200).json(new ApiResponse(200, journey, 'Active journey fetched'));
});

// ── GET /api/v1/journeys/me ──────────────────────────────────────────────────────
const getMyJourneys = asyncHandler(async (req, res) => {
  // The frontend expects a plain array here, not a paginated envelope.
  const { items } = await journeyService.getMyJourneys(req.user._id, req.query);

  return res.status(200).json(new ApiResponse(200, items, 'Journey history fetched'));
});

module.exports = {
  startJourney,
  addSnapshot,
  endJourney,
  cancelJourney,
  getActiveJourney,
  getMyJourneys,
};
