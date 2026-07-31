const express = require('express');
const router = express.Router();

const feedbackController = require('../controllers/feedback.controller');
const { validate } = require('../middlewares/validate.middleware');
const { submitFeedbackSchema } = require('../validators/feedback.validator');

// No auth guard — feedback is anonymous by design, open to any user
// (logged in or not). Broad abuse protection still comes from the global
// apiLimiter mounted in app.js; a stricter per-route limiter is Week 7.
router.post('/', validate(submitFeedbackSchema), feedbackController.submitFeedback);

module.exports = router;
