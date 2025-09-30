// src/modules/votes/routes.js
const express = require('express');
const { castVoteController, getResultsController } = require('./controller');
const authMiddleware = require('../../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/cast', castVoteController);
router.get('/results/:electionId', getResultsController);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string }
 *                     user: { type: object }
 */
module.exports = router;