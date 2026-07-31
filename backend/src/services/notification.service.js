const Notification = require('../models/Notification.model');
const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { admin, isFirebaseReady } = require('../config/firebase');
const { getPagination, buildPaginatedResult } = require('../utils/pagination');

const modelForRole = (role) => (role === 'passenger' ? User : Driver);
const recipientModelForRole = (role) => (role === 'passenger' ? 'User' : 'Driver');

// ── Device token management ──────────────────────────────────────────────────────

/**
 * Saves the FCM device token for the currently authenticated user/driver.
 * Called by the client right after it obtains a token from the FCM SDK.
 */
const registerDeviceToken = async ({ userId, role, fcmToken }) => {
  const Model = modelForRole(role);
  const user = await Model.findByIdAndUpdate(userId, { fcmToken }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  return { registered: true };
};

/** Clears the device token, e.g. on logout or when push permission is revoked. */
const clearDeviceToken = async ({ userId, role }) => {
  const Model = modelForRole(role);
  await Model.findByIdAndUpdate(userId, { fcmToken: null });
};

// ── Sending ────────────────────────────────────────────────────────────────────

/**
 * Creates a Notification record and attempts to push it via FCM.
 * Always persists the record — even if the recipient has no device token or
 * Firebase isn't configured — so it still shows up via GET /notifications.
 * Intended to be called from other services/jobs (e.g. journey or bus
 * events), not exposed directly as a public "send to anyone" route.
 */
const sendNotification = async ({
  recipientId,
  role,
  title,
  body,
  type = 'general',
  data = {},
}) => {
  const Model = modelForRole(role);
  const recipientModel = recipientModelForRole(role);

  const recipient = await Model.findById(recipientId);
  if (!recipient) throw new ApiError(404, 'Recipient not found');

  const notification = await Notification.create({
    recipient: recipientId,
    recipientModel,
    title,
    body,
    type,
    data,
  });

  if (isFirebaseReady() && recipient.fcmToken) {
    try {
      await admin.messaging().send({
        token: recipient.fcmToken,
        notification: { title, body },
        // FCM data payload values must be strings.
        data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      });
      notification.status = 'sent';
    } catch (err) {
      logger.error(`FCM send failed for ${recipientId}: ${err.message}`);
      notification.status = 'failed';
    }
    await notification.save();
  }
  // else: no device token or Firebase not configured — record stays
  // 'pending' and is still retrievable in-app.

  return notification;
};

// ── Reading (self only) ───────────────────────────────────────────────────────────

const getMyNotifications = async (userId, query = {}) => {
  const { page, limit, skip } = getPagination(query);

  const [items, total] = await Promise.all([
    Notification.find({ recipient: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ recipient: userId }),
  ]);

  return buildPaginatedResult(items, total, { page, limit });
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
};

module.exports = {
  registerDeviceToken,
  clearDeviceToken,
  sendNotification,
  getMyNotifications,
  markAsRead,
};
