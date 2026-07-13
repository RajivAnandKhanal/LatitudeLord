const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

// Shared handler so rate-limit rejections look like every other ApiError response.
const handler = (_req, _res, next) => {
  next(new ApiError(429, 'Too many requests — please slow down'));
};

// ── General API limiter ─────────────────────────────────────────────────────────
// Generous ceiling; mainly a backstop against abuse/scraping.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// ── Auth limiter ─────────────────────────────────────────────────────────────────
// Tighter window on login/register to slow down credential-stuffing/brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// ── Location ping limiter ───────────────────────────────────────────────────────
// A driver's app pings frequently (e.g. every few seconds via GPS), so this is
// deliberately much looser than the general limiter, just enough to catch a
// runaway client sending far faster than any real GPS device would.
const locationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

module.exports = { apiLimiter, authLimiter, locationLimiter };
