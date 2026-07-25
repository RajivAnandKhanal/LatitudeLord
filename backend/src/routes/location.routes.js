const express = require('express');
const router = express.Router();

const locationController = require('../controllers/location.controller');
const { verifyToken, attachUserIfPresent } = require('../middlewares/auth.middleware');
const { isDriver } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateLocationSchema } = require('../validators/location.validator');
const { locationLimiter } = require('../middlewares/rateLimiter.middleware');

// Public — passengers track buses. attachUserIfPresent lets getLocation
// upgrade to an ML-enhanced ETA for logged-in passengers without requiring auth.
router.get('/', locationController.getAllActiveLocations);
router.get('/:busId', attachUserIfPresent, locationController.getLocation);

// Driver-only — REST fallback for pushing a location ping (mirrors the socket event)
router.post(
  '/:busId',
  verifyToken,
  isDriver,
  locationLimiter,
  validate(updateLocationSchema),
  locationController.updateLocation
);

module.exports = router;
