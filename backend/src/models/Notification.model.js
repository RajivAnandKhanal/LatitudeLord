const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Polymorphic ref — recipient is either a passenger (User) or a
    // driver/staff account (Driver), same pattern as ChatMessage.senderModel.
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel',
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['User', 'Driver'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
      maxlength: [500, 'Body must be at most 500 characters'],
    },
    type: {
      type: String,
      enum: ['general', 'chat', 'busArrival', 'system'],
      default: 'general',
    },
    // Arbitrary payload forwarded to the client, e.g. { busId } so tapping
    // the notification can deep-link straight to that bus's screen.
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // 'sent' only means the FCM push succeeded — the record itself is
    // always persisted so it still shows up in-app via GET /notifications
    // even if the device token is missing/stale or Firebase isn't configured.
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
