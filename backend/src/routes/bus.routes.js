const express = require('express');
const router = express.Router();

const busController = require('../controllers/bus.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isDriver } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createBusSchema, updateBusSchema } = require('../validators/bus.validator');

// Public — passengers browse buses without logging in
router.get('/', busController.getAllBuses);
router.get('/:id', busController.getBusById);

// Driver-only — register & manage own bus
router.post('/', verifyToken, isDriver, validate(createBusSchema), busController.createBus);
router.patch('/:id', verifyToken, isDriver, validate(updateBusSchema), busController.updateBus);
router.delete('/:id', verifyToken, isDriver, busController.deleteBus);

module.exports = router;
