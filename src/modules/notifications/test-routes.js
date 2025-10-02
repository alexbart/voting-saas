const express = require("express");
const router = express.Router();
const { sendEmail } = require("./emailService");


// Test endpoint for email
router.post("/test-email", async (req, res) => {
  const { to, name } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, error: "Recipient email (to) is required" });
  }

  // Send using the "welcome" template
  const result = await sendEmail(
    to,
    "Welcome to Voting SaaS", 
    "welcome",
    {
      name: name || "Friend",
      year: new Date().getFullYear(),
    }
  );

  return res.json(result);
});

module.exports = router;
