// src/modules/votes/controller.js
const { success, error } = require('../../core/responses');
const { castVote, getResults } = require('./service');
const { logEvent } = require('../audit/service');

async function castVoteController(req, res) {
  try {
    const { user } = req; // Authenticated user from JWT
    const { ballot_id, selection } = req.body;

    if (!ballot_id || selection === undefined) {
      return error(res, 'Ballot ID and selection required', null, 400);
    }

    // ✅ Pass user.id as voterId
    const result = await castVote(user.id, ballot_id, selection, user.context);
    await logEvent(user.id, 'VOTE_CAST', { ballot_id, selection }, req.clientIp);

    return success(res, result, 'Vote recorded successfully');
  } catch (err) {
    console.error('Cast vote error:', err.message);
    if (err.message.includes('already voted') || err.message.includes('not active')) {
      return error(res, 'Vote not allowed', err.message, 403);
    }
    return error(res, 'Failed to cast vote', err.message, 500);
  }
}

async function getResultsController(req, res) {
  try {
    const { electionId } = req.params;
    const results = await getResults(electionId);
    return success(res, results);
  } catch (err) {
    console.error('Get results error:', err.message);
    return error(res, 'Failed to fetch results', err.message, 500);
  }
}

module.exports = { castVoteController, getResultsController };