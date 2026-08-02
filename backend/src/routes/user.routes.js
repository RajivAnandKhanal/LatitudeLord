const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateProfileSchema, changePasswordSchema } = require('../validators/user.validator');

// Every route here acts on "me" — the authenticated caller, passenger or driver/staff alike.
router.use(verifyToken);

router.get('/me', userController.getMe);
router.patch('/me', validate(updateProfileSchema), userController.updateMe);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

module.exports = router;
