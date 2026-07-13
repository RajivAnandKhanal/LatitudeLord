require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const { setupSockets } = require('./src/sockets/index');
const { startStaleLocationJob } = require('./src/jobs/staleLocation.job');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Boot
(async () => {
  await connectDB();

  setupSockets(server);
  startStaleLocationJob();

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
})();

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
