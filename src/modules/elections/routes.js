// src/modules/elections/routes.js
const express = require('express');
const {
  createElectionController,
  getElectionController,
  listElectionsController,
  activateElectionController,
  closeElectionController,
  deleteElectionController,
} = require('./controller');
const authMiddleware = require('../../middleware/auth'); // We'll create this next
const router = express.Router();

// Protected routes (require auth)
router.use(authMiddleware);

router.post('/', createElectionController);
router.get('/:id', getElectionController);
router.get('/context/:context', listElectionsController);

// NEW admin controls
router.post('/:id/activate', activateElectionController);
router.post('/:id/close', closeElectionController);

//Delete election
router.delete('/:id', deleteElectionController);

module.exports = router;