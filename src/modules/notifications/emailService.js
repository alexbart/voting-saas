const nodemailer = require("nodemailer");
const { create } = require("express-handlebars");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const pool = require("../../config/db"); // <-- using your db connection

// Transporter (Gmail example, works with Yahoo too)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Handlebars options
const handlebarOptions = {
  viewEngine: create({
    extname: ".hbs",
    partialsDir: path.resolve("./src/modules/notifications/templates/"),
    defaultLayout: false,
  }),
  viewPath: path.resolve("./src/modules/notifications/templates"),
  extName: ".hbs",
};

// Attach handlebars to nodemailer
transporter.use("compile", hbs(handlebarOptions));

/**
 * Save email log to DB
 */
async function logEmail({ recipient, subject, template, context, status, error }) {
  try {
    await pool.query(
      `INSERT INTO email_logs (recipient, subject, template, context, status, error)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        recipient,
        subject,
        template,
        context ? JSON.stringify(context) : null,
        status,
        error || null,
      ]
    );
  } catch (dbErr) {
    console.error("Failed to log email:", dbErr.message);
  }
}

/**
 * Send email with template
 */
async function sendEmail(to, subject, template, context = {}) {
  try {
    const info = await transporter.sendMail({
      from: `"Voting SaaS" <${process.env.SMTP_USER}>`,
      to,
      subject,
      template, // matches filename e.g. "welcome" → welcome.hbs
      context,  // dynamic variables passed into template
    });

    // Log success
    await logEmail({
      recipient: to,
      subject,
      template,
      context,
      status: "success",
      error: null,
    });

    return { success: true, info };
  } catch (err) {
    // Log failure
    await logEmail({
      recipient: to,
      subject,
      template,
      context,
      status: "failed",
      error: err.message,
    });

    return { success: false, error: err.message };
  }
}

module.exports = { sendEmail };
