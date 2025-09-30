// src/modules/audit/routes.js
const express = require('express');
const { getAuditLogs } = require('./controller');
const authMiddleware = require('../../middleware/auth');
const router = express.Router();

router.use(authMiddleware);
router.get('/', getAuditLogs); // GET /api/audit

module.exports = router;