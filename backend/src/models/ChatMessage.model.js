const mongoose = require('mongoose');

// Sender can be a passenger (User collection) or bus staff (Driver
// collection — drivers and conductors share that model). refPath lets
// populate() resolve the correct collection per-message.
const chatMessageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: [true, 'room is required'],
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'bus is required'],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'senderId is required'],
      refPath: 'senderModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['User', 'Driver'],
    },
    senderRole: {
      type: String,
      required: true,
      enum: ['passenger', 'driver', 'staff'],
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
      maxlength: [1000, 'Message must be at most 1000 characters'],
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Fetching a room's history newest-first is the hot path.
chatMessageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
