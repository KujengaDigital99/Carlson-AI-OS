'use strict';
const nodemailer = require('nodemailer');

/**
 * Email connector for Carlson Ifughe's AI OS.
 *
 * Two accounts:
 *   DOING   — carlson.ifughe@doing.biz (DBIA, investor comms, doing.biz brand)
 *   CSG     — carlson@cornerstoneglobal.africa (Cornerstone Global, formal/legal)
 *   CSG_INFO — info@cornerstoneglobal.africa (general Cornerstone inbox)
 *
 * Usage:
 *   const { sendEmail } = require('./connectors/email');
 *   await sendEmail({
 *     from:    'doing',          // 'doing' | 'csg' | 'csg_info'
 *     to:      'investor@example.com',
 *     subject: 'DBIA — Rwanda Webinar Follow-Up',
 *     text:    '...',            // plain text fallback
 *     html:    '<p>...</p>',     // optional HTML body
 *   });
 */

function buildTransport(account) {
  const configs = {
    doing: {
      host: process.env.DOING_SMTP_HOST || 'mail.doingbiz.africa',
      port: parseInt(process.env.DOING_SMTP_PORT, 10) || 465,
      secure: true,
      auth: {
        user: process.env.DOING_SMTP_USER,
        pass: process.env.DOING_SMTP_PASS,
      },
    },
    csg: {
      host: process.env.CSG_SMTP_HOST || 'mail.cornerstoneglobal.africa',
      port: parseInt(process.env.CSG_SMTP_PORT, 10) || 465,
      secure: true,
      auth: {
        user: process.env.CSG_SMTP_USER,
        pass: process.env.CSG_SMTP_PASS,
      },
    },
    csg_info: {
      host: process.env.CSG_SMTP_HOST || 'mail.cornerstoneglobal.africa',
      port: parseInt(process.env.CSG_SMTP_PORT, 10) || 465,
      secure: true,
      auth: {
        user: process.env.CSG_INFO_SMTP_USER,
        pass: process.env.CSG_INFO_SMTP_PASS,
      },
    },
  };

  const cfg = configs[account];
  if (!cfg) throw new Error(`Unknown email account: "${account}". Use 'doing', 'csg', or 'csg_info'.`);
  if (!cfg.auth.user || !cfg.auth.pass) {
    throw new Error(`Email credentials not set for account "${account}". Check .env file.`);
  }
  return nodemailer.createTransport(cfg);
}

const FROM_ADDRESSES = {
  doing:    'Carlson Ifughe <carlson.ifughe@doing.biz>',
  csg:      'Carlson Ifughe <carlson@cornerstoneglobal.africa>',
  csg_info: 'Cornerstone Global Africa <info@cornerstoneglobal.africa>',
};

/**
 * Send an email.
 *
 * @param {object} opts
 * @param {'doing'|'csg'|'csg_info'} opts.from   - Which account to send from
 * @param {string|string[]} opts.to               - Recipient address(es)
 * @param {string} opts.subject
 * @param {string} [opts.text]                    - Plain text body
 * @param {string} [opts.html]                    - HTML body (if provided, used instead of text in capable clients)
 * @param {string|string[]} [opts.cc]
 * @param {string|string[]} [opts.bcc]
 * @param {Array}  [opts.attachments]             - nodemailer attachments array
 * @returns {Promise<object>} nodemailer info object
 */
async function sendEmail({ from = 'doing', to, subject, text, html, cc, bcc, attachments }) {
  if (!to) throw new Error('sendEmail: "to" is required');
  if (!subject) throw new Error('sendEmail: "subject" is required');
  if (!text && !html) throw new Error('sendEmail: either "text" or "html" body is required');

  const transport = buildTransport(from);
  const info = await transport.sendMail({
    from: FROM_ADDRESSES[from],
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    attachments,
  });

  console.log(`[EMAIL:${from.toUpperCase()}] Sent → ${Array.isArray(to) ? to.join(', ') : to} | ${info.messageId}`);
  return info;
}

/**
 * Verify SMTP connection for a given account. Useful for testing credentials.
 *
 * @param {'doing'|'csg'|'csg_info'} account
 * @returns {Promise<boolean>}
 */
async function verifyConnection(account) {
  const transport = buildTransport(account);
  await transport.verify();
  console.log(`[EMAIL:${account.toUpperCase()}] SMTP connection verified`);
  return true;
}

module.exports = { sendEmail, verifyConnection };
