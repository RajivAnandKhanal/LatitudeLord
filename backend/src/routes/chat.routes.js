const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { sendMessageSchema } = require('../validators/chat.validator');

// Chat is authenticated-only — anonymous passengers can't message bus staff
// (mirrors the "authenticated landing page" chat feature in the app design).
router.get('/:busId/messages', verifyToken, chatController.getMessages);
router.post(
  '/:busId/messages',
  verifyToken,
  validate(sendMessageSchema),
  chatController.sendMessage
);

module.exports = router;
