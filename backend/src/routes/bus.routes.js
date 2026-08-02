const express = require('express');
const router = express.Router();

const busController = require('../controllers/bus.controller');
const { verifyToken, attachUserIfPresent } = require('../middlewares/auth.middleware');
const { isDriver } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createBusSchema, updateBusSchema } = require('../validators/bus.validator');

// Public — passengers browse buses without logging in.
// attachUserIfPresent lets ?driver=me resolve to the caller's own id when a
// token is present, without requiring auth for anonymous browsing.
router.get('/', attachUserIfPresent, busController.getAllBuses);
router.get('/:id', busController.getBusById);

// Driver-only — register & manage own bus
router.post('/', verifyToken, isDriver, validate(createBusSchema), busController.createBus);
router.patch('/:id', verifyToken, isDriver, validate(updateBusSchema), busController.updateBus);
router.delete('/:id', verifyToken, isDriver, busController.deleteBus);

module.exports = router;
