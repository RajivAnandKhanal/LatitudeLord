const express = require('express');
const router = express.Router();

const journeyController = require('../controllers/journey.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isPassenger } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  startJourneySchema,
  snapshotSchema,
  endJourneySchema,
} = require('../validators/journey.validator');

// Journey tracking is passenger-only — this feeds the ML training-data
// pipeline and isn't something drivers/staff interact with.
router.post(
  '/start',
  verifyToken,
  isPassenger,
  validate(startJourneySchema),
  journeyController.startJourney
);
router.post(
  '/:id/snapshot',
  verifyToken,
  isPassenger,
  validate(snapshotSchema),
  journeyController.addSnapshot
);
router.post(
  '/:id/end',
  verifyToken,
  isPassenger,
  validate(endJourneySchema),
  journeyController.endJourney
);
router.post('/:id/cancel', verifyToken, isPassenger, journeyController.cancelJourney);
router.get('/active', verifyToken, isPassenger, journeyController.getActiveJourney);
router.get('/me', verifyToken, isPassenger, journeyController.getMyJourneys);

module.exports = router;
