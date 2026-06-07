const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Returns the correct model based on role.
 * Passengers → User, drivers/staff → Driver.
 */
const getModelByRole = (role) => {
  if (role === 'passenger') return User;
  if (role === 'driver' || role === 'staff') return Driver;
  throw new ApiError(400, `Unknown role: ${role}`);
};

const issueTokens = (payload) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken({ _id: payload._id }),
});

// ── Service methods ────────────────────────────────────────────────────────────

/**
 * Register a new user (passenger or driver).
 */
const register = async ({ name, email, password, role = 'passenger', phone }) => {
  const Model = getModelByRole(role);

  const existing = await Model.findOne({ email });
  if (existing) throw new ApiError(409, 'Email is already registered');

  const user = await Model.create({ name, email, password, role, phone });

  const tokenPayload = { _id: user._id.toString(), role: user.role };
  const { accessToken, refreshToken } = issueTokens(tokenPayload);

  // Persist hashed-ish refresh token (store raw — stateless; swap to hash if needed)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicJSON(), accessToken, refreshToken };
};

/**
 * Login with email + password.
 */
const login = async ({ email, password, role = 'passenger' }) => {
  const Model = getModelByRole(role);

  // Must select password explicitly (select: false on schema)
  const user = await Model.findOne({ email }).select('+password +refreshToken');
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (!user.isActive) throw new ApiError(403, 'Account is deactivated');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const tokenPayload = { _id: user._id.toString(), role: user.role };
  const { accessToken, refreshToken } = issueTokens(tokenPayload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicJSON(), accessToken, refreshToken };
};

/**
 * Clear the refresh token (logout).
 */
const logout = async ({ userId, role }) => {
  const Model = getModelByRole(role);
  await Model.findByIdAndUpdate(userId, { refreshToken: null });
};

/**
 * Issue a new access token from a valid refresh token.
 */
const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) throw new ApiError(401, 'Refresh token is required');

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // Try both models — we don't know role from the refresh token alone
  let user = await User.findById(decoded._id).select('+refreshToken');
  if (!user) user = await Driver.findById(decoded._id).select('+refreshToken');
  if (!user) throw new ApiError(401, 'User not found');

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is invalid or already used');
  }

  const tokenPayload = { _id: user._id.toString(), role: user.role };
  const { accessToken, refreshToken } = issueTokens(tokenPayload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

module.exports = { register, login, logout, refreshAccessToken };
