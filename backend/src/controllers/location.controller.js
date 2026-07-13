const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const locationService = require('../services/location.service');

// ── POST /api/v1/location/:busId ────────────────────────────────────────────────
// Driver-only. REST fallback for clients that aren't using the socket connection.
const updateLocation = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { lat, lng, speedKmh, heading } = req.body;

  const location = await locationService.updateLocation({
    busId,
    driverId: req.user._id,
    lat,
    lng,
    speedKmh,
    heading,
  });

  return res.status(200).json(new ApiResponse(200, location, 'Location updated'));
});

// ── GET /api/v1/location/:busId ─────────────────────────────────────────────────
// Public — passengers track a specific bus.
const getLocation = asyncHandler(async (req, res) => {
  const location = await locationService.getLocation(req.params.busId);

  return res.status(200).json(new ApiResponse(200, location, 'Location fetched'));
});

// ── GET /api/v1/location ────────────────────────────────────────────────────────
// Public — live map of every bus currently online.
const getAllActiveLocations = asyncHandler(async (req, res) => {
  const locations = await locationService.getAllActiveLocations();

  return res.status(200).json(new ApiResponse(200, locations, 'Active locations fetched'));
});

module.exports = { updateLocation, getLocation, getAllActiveLocations };
