const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const rootRouter = require('./src/routes/index');
const errorHandler = require('./src/middlewares/errorHandler.middleware');
const notFound = require('./src/middlewares/notFound.middleware');

const app = express();

// ── Security & utility middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (skip in test env to keep output clean)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/v1', rootRouter);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Error handling (must be last) ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
