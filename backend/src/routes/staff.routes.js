const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staff.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isDriver } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createStaffSchema, updateStaffSchema } = require('../validators/staff.validator');

// Every staff route is driver-only — this is the driver's "manage bus staff" screen.
router.use(verifyToken, isDriver);

router.post('/', validate(createStaffSchema), staffController.createStaff);
router.get('/', staffController.getMyStaff);
router.get('/:id', staffController.getStaffById);
router.patch('/:id', validate(updateStaffSchema), staffController.updateStaff);
router.delete('/:id', staffController.removeStaff);

module.exports = router;
