const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const notificationService = require('../services/notification.service');

// ── POST /api/v1/notifications/register-token ──────────────────────────────────
const registerToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;
  const result = await notificationService.registerDeviceToken({
    userId: req.user._id,
    role: req.user.role,
    fcmToken,
  });

  return res.status(200).json(new ApiResponse(200, result, 'Device token registered'));
});

// ── DELETE /api/v1/notifications/register-token ─────────────────────────────────
const unregisterToken = asyncHandler(async (req, res) => {
  await notificationService.clearDeviceToken({ userId: req.user._id, role: req.user.role });

  return res.status(200).json(new ApiResponse(200, null, 'Device token cleared'));
});

// ── GET /api/v1/notifications ────────────────────────────────────────────────────
const getMyNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getMyNotifications(req.user._id, req.query);

  return res.status(200).json(new ApiResponse(200, result, 'Notifications fetched'));
});

// ── PATCH /api/v1/notifications/:id/read ────────────────────────────────────────
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);

  return res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read'));
});

module.exports = { registerToken, unregisterToken, getMyNotifications, markAsRead };
