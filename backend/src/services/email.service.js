const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Sends transactional email via Resend's HTTP API (https://resend.com).
 * No extra SDK needed — just an authenticated fetch call.
 */
const sendEmail = async ({ to, subject, html }) => {
  const { RESEND_API_KEY, EMAIL_FROM } = process.env;

  if (!RESEND_API_KEY || !EMAIL_FROM) {
    logger.error('RESEND_API_KEY or EMAIL_FROM not set — cannot send email');
    throw new ApiError(500, 'Email service is not configured');
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    logger.error(`Resend send failed: ${response.status} ${body}`);
    throw new ApiError(502, 'Failed to send email');
  }
};

const sendPasswordResetEmail = async (to, code) => {
  await sendEmail({
    to,
    subject: 'Your LatitudeLord password reset code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>Use the code below to reset your LatitudeLord password. It expires in 15 minutes.</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 6px;">${code}</p>
        <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
