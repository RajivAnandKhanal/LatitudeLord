const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { registerTokenSchema } = require('../validators/notification.validator');

// Every notification route is personal — the recipient can only ever be "me".
router.use(verifyToken);

router.post('/register-token', validate(registerTokenSchema), notificationController.registerToken);
router.delete('/register-token', notificationController.unregisterToken);
router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
