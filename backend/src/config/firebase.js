const admin = require('firebase-admin');
const logger = require('./logger');

// ── Firebase Admin (FCM push notifications) ─────────────────────────────────────
// Optional, same philosophy as config/redis.js: if the env vars aren't set,
// the app still boots fine — notification.service.js just keeps writing
// Notification records to Mongo without attempting a push.

let initialized = false;

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // .env stores the key with literal "\n" sequences — restore real newlines.
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    initialized = true;
    logger.info('Firebase Admin initialized');
  } catch (err) {
    logger.error(`Firebase Admin init failed: ${err.message}`);
  }
} else {
  logger.info('Firebase env vars not set — push notifications disabled (DB records only)');
}

/** True if Firebase Admin is initialized and ready to send pushes. */
const isFirebaseReady = () => initialized;

module.exports = { admin, isFirebaseReady };
