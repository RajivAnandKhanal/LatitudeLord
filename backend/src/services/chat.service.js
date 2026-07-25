const ChatRoom = require('../models/ChatRoom.model');
const ChatMessage = require('../models/ChatMessage.model');
const Bus = require('../models/Bus.model');
const ApiError = require('../utils/ApiError');
const { getPagination, buildPaginatedResult } = require('../utils/pagination');

const senderModelForRole = (role) => (role === 'passenger' ? 'User' : 'Driver');

/**
 * Finds a bus's chat room, creating it on first contact if it doesn't exist yet.
 */
const getOrCreateRoom = async (busId) => {
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, 'Bus not found');

  const room = await ChatRoom.findOneAndUpdate(
    { bus: busId },
    { bus: busId },
    { upsert: true, new: true }
  );

  return room;
};

/**
 * Persists a chat message and bumps the room's lastMessageAt.
 * Used by both the socket handler and the REST fallback, so they stay in lockstep.
 */
const sendMessage = async ({ busId, senderId, senderRole, text }) => {
  const room = await getOrCreateRoom(busId);

  const message = await ChatMessage.create({
    room: room._id,
    bus: busId,
    senderId,
    senderModel: senderModelForRole(senderRole),
    senderRole,
    text,
  });

  room.lastMessageAt = message.createdAt;
  await room.save();

  return message;
};

/**
 * Paginated message history for a bus's chat room. `page=1` returns the
 * most recent messages, each page internally ordered oldest → newest so a
 * chat UI can render it top-to-bottom without re-sorting.
 */
const getMessages = async (busId, query = {}) => {
  const room = await ChatRoom.findOne({ bus: busId });
  const { page, limit, skip } = getPagination(query);

  if (!room) {
    return buildPaginatedResult([], 0, { page, limit });
  }

  const [messages, total] = await Promise.all([
    ChatMessage.find({ room: room._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ChatMessage.countDocuments({ room: room._id }),
  ]);

  return buildPaginatedResult(messages.reverse(), total, { page, limit });
};

module.exports = { getOrCreateRoom, sendMessage, getMessages };
