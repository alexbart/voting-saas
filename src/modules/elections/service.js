// src/modules/elections/service.js
const knex = require("../../db/knexfile");
const { loadContextConfig } = require("../../core/contextLoader");

async function createElection(adminId, electionData) {
  const {
    title,
    description,
    context_type,
    start_time,
    end_time,
    ballot,
    status = "scheduled",
  } = electionData;
  const contextConfig = loadContextConfig(context_type);

  //Validate status
  const validStatuses = ["scheduled", "active"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid election status");
  }

  const now = new Date();
  let finalStartTime = start_time;
  let finalStatus = status;
  let activatedAt = null;

  if (status === "active") {
    finalStartTime = now;
    activatedAt = now;
  }

  // Time validation only for 'scheduled'
  // if (status === "scheduled") {
  //   if (new Date(start_time) <= now) {
  //     throw new Error(
  //       "Start time must be in the future for scheduled elections"
  //     );
  //   }
  //   if (new Date(end_time) <= new Date(start_time)) {
  //     throw new Error("End time must be after start time");
  //   }
  // }


  // Auto-correct times for 'scheduled' elections
  //Fallback
  if (status === "scheduled") {
  let start = new Date(start_time);
  let end = new Date(end_time);

  if (isNaN(start.getTime())) start = new Date();
  if (isNaN(end.getTime())) end = new Date(start.getTime() + 60 * 60 * 1000);

  if (start <= now) {
    console.warn("start_time in past, auto-adjusting to now");
    start = new Date(now.getTime() + 1000); // +1s into future
  }
  if (end <= start) {
    console.warn("end_time invalid, auto-adjusting to +1h from start");
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  finalStartTime = start;
  electionData.end_time = end;
}


  return knex.transaction(async (trx) => {
    const [electionRecord] = await trx("elections")
      .insert({
        title,
        description,
        context_type,
        start_time: finalStartTime,
        end_time,
        status: finalStatus,
        activated_at: activatedAt,
        created_by: adminId,
        is_active: true,
      })
      .returning("id");

    const electionId = electionRecord.id;

    await trx("ballots").insert({
      election_id: electionId,
      question: ballot.question,
      options: JSON.stringify(ballot.options),
      ballot_type: ballot.ballot_type || "single_choice",
    });

    return {
      id: electionId,
      status: finalStatus,
      context_config: contextConfig,
    };
  });
}

// NEW: Activate election
async function activateElection(electionId) {
  const now = new Date();
  const result = await knex("elections")
    .where({ id: electionId, })
    .andWhere("status", "!=", "closed")
    .update({
      status: "active",
      activated_at: now,
      start_time: now,
    });
  if (result === 0) throw new Error("Election not found or already closed");
}

// NEW: Close election
async function closeElection(electionId) {
  const now = new Date();
  const result = await knex("elections")
    .where({ id: electionId })
    .andWhere("status", "!=", "closed")
    .update({
      status: "closed",
      closed_at: now,
      end_time: now,
    });
  if (result === 0) throw new Error("Election not found or already closed");
}

async function getElectionById(electionId) {
  const election = await knex("elections")
    .where({ id: electionId, is_active: true })
    .first();

  if (!election) return null;

  const ballot = await knex("ballots")
    .where({ election_id: electionId })
    .first();

  // ✅ Parse options when reading from DB
  if (ballot && typeof ballot.options === "string") {
    try {
      ballot.options = JSON.parse(ballot.options);
    } catch (e) {
      console.error("Invalid JSON in ballot.options:", ballot.options);
    }
  }

  return { ...election, ballot };
}

async function listElectionsByContext(context_type) {
  return knex("elections")
    .where({ context_type, is_active: true })
    .orderBy("start_time", "desc");
}

// Soft-delete election (only if scheduled and no votes)
async function deleteElection(electionId, adminId) {
  // Check election status and vote count
  const election = await knex('elections')
    .where({ id: electionId, created_by: adminId, is_active: true })
    .first();
  
  if (!election) {
    throw new Error('Election not found or not owned by admin');
  }

  if (election.status !== 'scheduled') {
    throw new Error('Only scheduled elections can be deleted');
  }

  const voteCount = await knex('votes')
    .join('ballots', 'votes.ballot_id', 'ballots.id')
    .where('ballots.election_id', electionId)
    .count('votes.id as count')
    .first();

  if (parseInt(voteCount.count) > 0) {
    throw new Error('Cannot delete election with votes');
  }

  // Soft delete: mark as inactive
  await knex('elections').where({ id: electionId }).update({ is_active: false });
}

module.exports = { createElection, getElectionById, listElectionsByContext, activateElection, closeElection, deleteElection };
