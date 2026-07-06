const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

// ── POST /api/v1/auth/register ─────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const result = await authService.register({ name, email, password, role, phone });

  return res.status(201).json(new ApiResponse(201, result, 'Registration successful'));
});

// ── POST /api/v1/auth/login ────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const result = await authService.login({ email, password, role });

  return res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

// ── POST /api/v1/auth/logout ───────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  await authService.logout({ userId: req.user._id, role: req.user.role });

  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

// ── POST /api/v1/auth/refresh-token ───────────────────────────────────────────
const refreshToken = asyncHandler(async (req, res) => {
  const incoming = req.body.refreshToken;
  const result = await authService.refreshAccessToken(incoming);

  return res.status(200).json(new ApiResponse(200, result, 'Token refreshed'));
});

// ── GET /api/v1/auth/me ────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'Authenticated user'));
});

module.exports = { register, login, logout, refreshToken, getMe };
