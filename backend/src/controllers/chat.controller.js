const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const chatService = require('../services/chat.service');

// ── GET /api/v1/chat/:busId/messages ────────────────────────────────────────────
// Authenticated — passengers and bus staff both read the same room history.
const getMessages = asyncHandler(async (req, res) => {
  // The frontend expects a plain array here, not a paginated envelope.
  const { items } = await chatService.getMessages(req.params.busId, req.query);

  return res.status(200).json(new ApiResponse(200, items, 'Messages fetched'));
});

// ── POST /api/v1/chat/:busId/messages ───────────────────────────────────────────
// REST fallback for clients not using the socket connection (mirrors location:ping).
const sendMessage = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { text } = req.body;

  const message = await chatService.sendMessage({
    busId,
    senderId: req.user._id,
    senderRole: req.user.role,
    text,
  });

  return res.status(201).json(new ApiResponse(201, message, 'Message sent'));
});

module.exports = { getMessages, sendMessage };
