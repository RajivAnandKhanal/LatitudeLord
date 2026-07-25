const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const Journey = require('../models/Journey.model');
const mlService = require('../services/ml.service');
const logger = require('../config/logger');
const { ML_EXPORT_CRON } = require('../config/constants');

const EXPORT_DIR = path.join(process.cwd(), 'logs', 'ml-exports');

/**
 * Nightly export of completed-but-not-yet-exported journeys for the ML
 * training pipeline. Tries the configured ML service first; if it's
 * unreachable/unconfigured, falls back to writing a local JSON batch file
 * so no data is lost — it can still be picked up by a later run or a
 * manual import.
 */
const runExport = async () => {
  const journeys = await Journey.find({ status: 'completed', exportedForML: false }).lean();

  if (journeys.length === 0) {
    logger.info('ML export: no new journeys to export');
    return;
  }

  const accepted = await mlService.exportJourneys(journeys);

  if (!accepted) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
    const filename = `journeys-${new Date().toISOString().slice(0, 10)}-${Date.now()}.json`;
    fs.writeFileSync(path.join(EXPORT_DIR, filename), JSON.stringify(journeys, null, 2));
    logger.warn(
      `ML export: service unavailable, wrote local batch (${journeys.length} journeys) to ${filename}`
    );
  } else {
    logger.info(`ML export: sent ${journeys.length} journeys to ML service`);
  }

  await Journey.updateMany({ _id: { $in: journeys.map((j) => j._id) } }, { exportedForML: true });
};

const startMlExportJob = () => {
  cron.schedule(ML_EXPORT_CRON, async () => {
    try {
      await runExport();
    } catch (err) {
      logger.error(`ML export job failed: ${err.message}`);
    }
  });

  logger.info(`ML data export job scheduled (${ML_EXPORT_CRON})`);
};

module.exports = { startMlExportJob, runExport };
