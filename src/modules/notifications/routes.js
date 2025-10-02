const express = require("express");
const { sendSms } = require("./dapinSmsService");
const { sendEmail } = require("./emailService");
const pool = require("../../config/db"); // Postgres pool

const router = express.Router();

/**
 * Unified Response Helper
 */
function respond(res, success, message, data = null, error = null) {
  const payload = { success, message };
  if (data) payload.data = data;
  if (error) payload.error = error;
  return res.json(payload);
}

/**
 * Send SMS
 */
router.post("/sms", async (req, res) => {
  try {
    const { to, message, scheduleDate } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: "Recipient (to) and message are required",
      });
    }

    const result = await sendSms({ to, message, scheduleDate });
    respond(res, true, "SMS sent successfully", result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send SMS",
      error: err.message,
      details: err.response?.data,
    });
  }
});

/**
 * Send Email
 */
router.post("/email", async (req, res) => {
  try {
    const {
      provider = "gmail",
      to,
      subject,
      template = "welcome",
      context = {},
    } = req.body;

    if (!to) {
      return respond(res, false, "Validation error", null, "Recipient (to) is required");
    }

    const info = await sendEmail(to, subject, template, context);
    respond(res, true, "Email sent successfully", info);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: err.message,
      details: err.response?.data,
    });
  }
});

/**
 * Test Email (calls /email logic under the hood)
 */
router.post("/test-email", async (req, res, next) => {
  req.body.subject = "Welcome to Voting SaaS";
  req.body.template = "welcome";
  req.body.context = {
    name: req.body.name || "Friend",
    year: new Date().getFullYear(),
  };
  return router.handle({ ...req, url: "/email", method: "POST" }, res, next);
});

/**
 * Fetch Email Logs (Audit Trail)
 */
router.get("/email/logs", async (req, res) => {
  try {
    const { status, template, recipient, limit = 50, offset = 0 } = req.query;

    let query = "SELECT * FROM email_logs WHERE 1=1";
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (template) {
      params.push(template);
      query += ` AND template = $${params.length}`;
    }
    if (recipient) {
      params.push(recipient);
      query += ` AND recipient = $${params.length}`;
    }

    params.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(query, params);

    respond(res, true, "Email logs fetched successfully", { logs: result.rows });
  } catch (err) {
    respond(res, false, "Failed to fetch email logs", null, err.message);
  }
});

module.exports = router;
