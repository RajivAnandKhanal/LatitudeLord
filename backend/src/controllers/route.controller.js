const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Bus = require('../models/Bus.model');
const Route = require('../models/Route.model');
const { getPagination, buildPaginatedResult } = require('../utils/pagination');

// ── Helper ───────────────────────────────────────────────────────────────────────
const assertOwnsBus = async (busId, userId) => {
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, 'Bus not found');
  if (bus.driver.toString() !== userId.toString()) {
    throw new ApiError(403, 'You do not own this bus');
  }
  return bus;
};

// ── PUT /api/v1/routes/:busId ───────────────────────────────────────────────────
// Create or replace the full weekly schedule for a bus in one shot (idempotent set).
const setSchedule = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { schedule } = req.body;

  const bus = await assertOwnsBus(busId, req.user._id);

  const route = await Route.findOneAndUpdate(
    { busId },
    { busId, schedule },
    { upsert: true, new: true, runValidators: true }
  );

  // Keep Bus.route pointer in sync so GET /buses/:id can populate it directly.
  if (!bus.route || bus.route.toString() !== route._id.toString()) {
    bus.route = route._id;
    await bus.save();
  }

  return res.status(200).json(new ApiResponse(200, route, 'Weekly schedule saved'));
});

// ── GET /api/v1/routes ──────────────────────────────────────────────────────────
// Public — passengers can browse all published schedules.
const getAllRoutes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [routes, total] = await Promise.all([
    Route.find().populate('busId', 'busNumber plateNumber status').skip(skip).limit(limit),
    Route.countDocuments(),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, buildPaginatedResult(routes, total, { page, limit }), 'Routes fetched')
    );
});

// ── GET /api/v1/routes/:busId ───────────────────────────────────────────────────
const getScheduleByBus = asyncHandler(async (req, res) => {
  const route = await Route.findOne({ busId: req.params.busId }).populate(
    'busId',
    'busNumber plateNumber status'
  );
  if (!route) throw new ApiError(404, 'No schedule found for this bus');

  return res.status(200).json(new ApiResponse(200, route, 'Schedule fetched'));
});

// ── DELETE /api/v1/routes/:busId ────────────────────────────────────────────────
// Owning driver only.
const deleteSchedule = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const bus = await assertOwnsBus(busId, req.user._id);

  const route = await Route.findOneAndDelete({ busId });
  if (!route) throw new ApiError(404, 'No schedule found for this bus');

  bus.route = null;
  await bus.save();

  return res.status(200).json(new ApiResponse(200, null, 'Schedule removed'));
});

module.exports = { setSchedule, getAllRoutes, getScheduleByBus, deleteSchedule };
