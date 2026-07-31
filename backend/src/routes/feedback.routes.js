const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedback.controller');
const { validate } = require('../middlewares/validate.middleware');
const { submitFeedbackSchema } = require('../validators/feedback.validator');
const { feedbackLimiter } = require('../middlewares/rateLimiter.middleware');

// No auth guard — feedback is anonymous by design, open to any user
// (logged in or not). feedbackLimiter gives it a stricter per-route ceiling
// on top of the global apiLimiter mounted in app.js.
router.post(
  '/',
  feedbackLimiter,
  validate(submitFeedbackSchema),
  feedbackController.submitFeedback
);

module.exports = router;
