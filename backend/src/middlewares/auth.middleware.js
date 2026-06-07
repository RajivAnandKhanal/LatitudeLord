const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyAccessToken } = require('../utils/tokenUtils');
const User = require('../models/User.model');
const Driver = require('../models/Driver.model');

/**
 * verifyToken — protects any route that requires authentication.
 * Attaches the full user document to req.user.
 */
const verifyToken = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization token is missing');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired access token');
  }

  // Look up in the appropriate collection
  let user;
  if (decoded.role === 'passenger') {
    user = await User.findById(decoded._id);
  } else {
    user = await Driver.findById(decoded._id);
  }

  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or account deactivated');
  }

  req.user = user;
  next();
});

module.exports = { verifyToken };
