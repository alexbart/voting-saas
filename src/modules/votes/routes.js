// src/modules/votes/routes.js
const express = require('express');
const { castVoteController, getResultsController } = require('./controller');
const authMiddleware = require('../../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/cast', castVoteController);
router.get('/results/:electionId', getResultsController);

module.exports = router;