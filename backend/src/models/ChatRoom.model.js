const mongoose = require('mongoose');

// One chat room per bus — passengers message whichever driver/staff are
// linked to that bus. Keyed by busId (not by individual passenger pair) so
// the room count stays small and matches the "chat with bus staff" flow
// described in the app design.
const chatRoomSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'bus is required'],
      unique: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
