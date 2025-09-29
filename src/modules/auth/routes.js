// src/modules/auth/routes.js
const express = require('express');
const { login, register } = require('./controller');
const router = express.Router();

router.post('/login', login);
router.post('/register', register); // For simplicity, using login controller for registration too

module.exports = router;