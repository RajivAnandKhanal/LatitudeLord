const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const BusFeedback = require('../models/BusFeedback.model');
const { containsBadWord } = require('../services/wordFilter.service');

// ── POST /api/v1/feedback ────────────────────────────────────────────────────────
// Public & fully anonymous — no user identity is ever stored alongside the
// message (mirrors the "Bug Report/feedback" screen shared by both the
// passenger and driver sidebars). Messages containing Nepali or English
// profanity are rejected before anything touches the database.
const submitFeedback = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (containsBadWord(message)) {
    throw new ApiError(422, 'Your message contains inappropriate language and was not sent');
  }

  const feedback = await BusFeedback.create({ message });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { id: feedback._id, submittedAt: feedback.createdAt },
        'Feedback submitted anonymously — thank you!'
      )
    );
});

module.exports = { submitFeedback };
