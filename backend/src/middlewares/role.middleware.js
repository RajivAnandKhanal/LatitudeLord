const ApiError = require('../utils/ApiError');

/**
 * Factory that returns a middleware allowing only the specified roles.
 * Must be used AFTER verifyToken.
 *
 * Usage: router.get('/route', verifyToken, allowRoles('driver', 'staff'), handler)
 */
const allowRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Requires role: ${roles.join(' or ')}`));
    }
    next();
  };

// Convenience guards
const isPassenger = allowRoles('passenger');
const isDriver = allowRoles('driver');
const isStaff = allowRoles('staff');
const isDriverOrStaff = allowRoles('driver', 'staff');

module.exports = { allowRoles, isPassenger, isDriver, isStaff, isDriverOrStaff };
