// src/modules/votes/service.js
const knex = require('../../db/knexfile');

async function castVote(voterId, ballotId, selection, context_type) {
  // Get ballot and election
  const ballot = await knex('ballots').where({ id: ballotId }).first();
  if (!ballot) throw new Error('Ballot not found');

  // Parse ballot.options if string
  let options = ballot.options;
  if (typeof options === 'string') {
    options = JSON.parse(options);
  }

  const election = await knex('elections')
    .where({ id: ballot.election_id, is_active: true })
    .first();
  if (!election) throw new Error('Election not active');

  // ✅ Use status-based voting (not time)
  if (election.status === 'scheduled' || election.status === 'draft') {
    throw new Error('Voting has not started');
  }
  if (election.status === 'closed') {
    throw new Error('Voting has ended');
  }

  // Prevent double voting
  const existingVote = await knex('votes')
    .where({ ballot_id: ballotId, voter_id: voterId })
    .first();
  if (existingVote) throw new Error('You have already voted');

  // Validate selection
  if (ballot.ballot_type === 'single_choice') {
    if (typeof selection !== 'string' || !options.includes(selection)) {
      throw new Error('Invalid selection for single-choice ballot');
    }
  } else if (ballot.ballot_type === 'multi_choice') {
    if (!Array.isArray(selection) || selection.length === 0 || selection.some(opt => !options.includes(opt))) {
      throw new Error('Invalid selection for multi-choice ballot');
    }
  }

  // Determine weight
  let weight = 1;
  if (context_type === 'board') {
    const voter = await knex('users').where({ id: voterId }).first();
    if (voter?.external_id) {
      const parsed = parseInt(voter.external_id, 10);
      weight = isNaN(parsed) ? 1 : parsed;
    }
  }

  // ✅ CORRECT COLUMN NAMES: voter_id, cast_at (NOT user_id, created_at)
  await knex('votes').insert({
    ballot_id: ballotId,
    voter_id: voterId,      // ✅ matches migration
    selection: JSON.stringify(selection),
    weight,
    cast_at: new Date()     // ✅ matches migration
  });

  return { success: true, weight };
}

async function getResults(electionId) {
  const ballots = await knex('ballots').where({ election_id: electionId });
  const results = [];

  for (const ballot of ballots) {
    const votes = await knex('votes').where({ ballot_id: ballot.id });
    const tallies = {};

    let options = ballot.options;
    if (typeof options === 'string') {
      options = JSON.parse(options);
    }

    if (ballot.ballot_type === 'single_choice') {
      votes.forEach(v => {
        let choice;
        try {
          choice = JSON.parse(v.selection);
        } catch (e) {
          choice = v.selection; // fallback for legacy
        }
        tallies[choice] = (tallies[choice] || 0) + v.weight;
      });
    } else if (ballot.ballot_type === 'multi_choice') {
      votes.forEach(v => {
        let choices;
        try {
          choices = JSON.parse(v.selection);
        } catch (e) {
          choices = [v.selection];
        }
        if (!Array.isArray(choices)) choices = [choices];
        choices.forEach(choice => {
          tallies[choice] = (tallies[choice] || 0) + v.weight;
        });
      });
    }

    results.push({
      ballot_id: ballot.id,
      question: ballot.question,
      options,
      tallies,
      total_votes: votes.length,
      total_weight: votes.reduce((sum, v) => sum + v.weight, 0)
    });
  }

  return results;
}

module.exports = { castVote, getResults };