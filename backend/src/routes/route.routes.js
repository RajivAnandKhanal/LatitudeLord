const express = require('express');
const router = express.Router();

const routeController = require('../controllers/route.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isDriver } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { setScheduleSchema } = require('../validators/route.validator');

// Public — passengers view schedules
router.get('/', routeController.getAllRoutes);
router.get('/:busId', routeController.getScheduleByBus);

// Driver-only — create/replace/remove the weekly schedule for their own bus
router.put(
  '/:busId',
  verifyToken,
  isDriver,
  validate(setScheduleSchema),
  routeController.setSchedule
);
router.delete('/:busId', verifyToken, isDriver, routeController.deleteSchedule);

module.exports = router;
