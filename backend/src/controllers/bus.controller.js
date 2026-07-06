const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Bus = require('../models/Bus.model');
const Route = require('../models/Route.model');
const { getPagination, buildPaginatedResult } = require('../utils/pagination');

// ── POST /api/v1/buses ──────────────────────────────────────────────────────────
// Driver registers a new bus. The driver is taken from the auth token, not the body.
const createBus = asyncHandler(async (req, res) => {
  const { busNumber, plateNumber, capacity } = req.body;

  const existing = await Bus.findOne({ $or: [{ busNumber }, { plateNumber }] });
  if (existing) throw new ApiError(409, 'A bus with this number or plate already exists');

  const bus = await Bus.create({
    busNumber,
    plateNumber,
    capacity,
    driver: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, bus, 'Bus registered successfully'));
});

// ── GET /api/v1/buses ───────────────────────────────────────────────────────────
// Public — passengers browse buses without logging in. Optional ?status= filter.
const getAllBuses = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  if (status) filter.status = status;

  const [buses, total] = await Promise.all([
    Bus.find(filter)
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Bus.countDocuments(filter),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, buildPaginatedResult(buses, total, { page, limit }), 'Buses fetched')
    );
});

// ── GET /api/v1/buses/:id ───────────────────────────────────────────────────────
const getBusById = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id).populate('driver', 'name phone').populate('route');
  if (!bus) throw new ApiError(404, 'Bus not found');

  return res.status(200).json(new ApiResponse(200, bus, 'Bus fetched'));
});

// ── PATCH /api/v1/buses/:id ──────────────────────────────────────────────────────
// Owning driver only. `driver` and `route` can't be changed here (stripped by Joi).
const updateBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) throw new ApiError(404, 'Bus not found');

  if (bus.driver.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not own this bus');
  }

  Object.assign(bus, req.body);
  await bus.save();

  return res.status(200).json(new ApiResponse(200, bus, 'Bus updated'));
});

// ── DELETE /api/v1/buses/:id ─────────────────────────────────────────────────────
// Owning driver only. Cascades to remove the bus's weekly schedule, if any.
const deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) throw new ApiError(404, 'Bus not found');

  if (bus.driver.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not own this bus');
  }

  await Route.deleteOne({ busId: bus._id });
  await bus.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Bus removed'));
});

module.exports = { createBus, getAllBuses, getBusById, updateBus, deleteBus };
