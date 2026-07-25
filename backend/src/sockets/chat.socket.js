const chatService = require('../services/chat.service');
const logger = require('../config/logger');

const room = (busId) => `chat:${busId}`;

// ── Chat handlers ─────────────────────────────────────────────────────────────
// Unlike location tracking, chat has no anonymous read path — every event
// here requires an authenticated socket.user (set by config/socket.js).
const registerChatSocket = (io, socket) => {
  socket.on('chat:join', ({ busId } = {}) => {
    if (!socket.user || !busId) return;
    socket.join(room(busId));
  });

  socket.on('chat:leave', ({ busId } = {}) => {
    if (!busId) return;
    socket.leave(room(busId));
  });

  socket.on('chat:message', async ({ busId, text } = {}, ack) => {
    const respond = (payload) => {
      if (typeof ack === 'function') ack(payload);
    };

    try {
      if (!socket.user) {
        return respond({ success: false, message: 'Authentication required to chat' });
      }
      if (!busId || !text || !text.trim()) {
        return respond({ success: false, message: 'busId and text are required' });
      }

      const message = await chatService.sendMessage({
        busId,
        senderId: socket.user._id,
        senderRole: socket.user.role,
        text: text.trim(),
      });

      io.to(room(busId)).emit('chat:message', message);
      respond({ success: true, data: message });
    } catch (err) {
      logger.error(`chat:message failed: ${err.message}`);
      respond({ success: false, message: err.message || 'Failed to send message' });
    }
  });
};

module.exports = { registerChatSocket, room };
