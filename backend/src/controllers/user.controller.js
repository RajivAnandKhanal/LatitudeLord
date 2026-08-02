const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// Fields each model actually owns — only these are written, so a passenger
// PATCHing `licenseNumber` (or a driver PATCHing `gender`) is silently a no-op
// rather than an error.
const PASSENGER_FIELDS = ['name', 'phone', 'avatar', 'gender', 'healthCondition'];
const DRIVER_FIELDS = ['name', 'phone', 'avatar', 'licenseNumber'];

// ── GET /api/v1/users/me ─────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user.toPublicJSON(), 'Profile fetched'));
});

// ── PATCH /api/v1/users/me ───────────────────────────────────────────────────────
const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = req.user.role === 'passenger' ? PASSENGER_FIELDS : DRIVER_FIELDS;

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();

  return res.status(200).json(new ApiResponse(200, req.user.toPublicJSON(), 'Profile updated'));
});

// ── POST /api/v1/users/change-password ───────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // req.user was loaded without +password by verifyToken — re-fetch with it selected.
  const Model = req.user.constructor;
  const user = await Model.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

module.exports = { getMe, updateMe, changePassword };
