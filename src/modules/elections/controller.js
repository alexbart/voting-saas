// src/modules/elections/controller.js
const { success, error } = require("../../core/responses");
const {
  createElection,
  getElectionById,
  listElectionsByContext,
  activateElection,
  closeElection,
} = require("./service");
const { logEvent } = require("../audit/service");

// Helper: Safely parse and validate ballot options
function validateAndParseOptions(options) {
  let parsedOptions = options;

  // If options is a string, try to parse it as JSON
  if (typeof options === "string") {
    try {
      parsedOptions = JSON.parse(options);
    } catch (e) {
      throw new Error("Ballot options must be a valid JSON array");
    }
  }

  // Must be an array
  if (!Array.isArray(parsedOptions)) {
    throw new Error("Ballot options must be an array");
  }

  // Must have at least 2 items
  if (parsedOptions.length < 2) {
    throw new Error("Ballot options must contain at least 2 items");
  }

  // All items must be non-empty strings
  if (
    !parsedOptions.every((opt) => typeof opt === "string" && opt.trim() !== "")
  ) {
    throw new Error("All ballot options must be non-empty strings");
  }

  return parsedOptions;
}

async function activateElectionController(req, res) {
  try {
    const { id } = req.params;
    const { user } = req;
    if (user.role !== "Admin") {
      return error(res, "Only admins can activate elections", null, 403);
    }
    await activateElection(id);
    await logEvent(
      user.id,
      "ELECTION_ACTIVATED",
      { election_id: id },
      req.clientIp
    );
    return success(res, null, "Election activated");
  } catch (err) {
    console.error("Activate error:", err);
    return error(res, "Failed to activate election", err.message, 500);
  }
}

// NEW: Close election
async function closeElectionController(req, res) {
  try {
    const { id } = req.params;
    const { user } = req;
    if (user.role !== "Admin") {
      return error(res, "Only admins can close elections", null, 403);
    }
    await closeElection(id);
    await logEvent(
      user.id,
      "ELECTION_CLOSED",
      { election_id: id },
      req.clientIp
    );
    return success(res, null, "Election closed");
  } catch (err) {
    console.error("Close error:", err);
    return error(res, "Failed to close election", err.message, 500);
  }
}

// Create a new election (Admin only)
// src/modules/elections/controller.js
async function createElectionController(req, res) {
  try {
    const { user } = req;
    const { title, description, context_type, start_time, end_time, ballot } =
      req.body;

    // Validate top-level required fields
    if (!title || !context_type || !start_time || !end_time || !ballot) {
      return error(res, "Missing required fields", null, 400);
    }

    // Validate ballot structure
    if (
      !ballot.question ||
      typeof ballot.question !== "string" ||
      ballot.question.trim() === ""
    ) {
      return error(res, "Ballot must have a valid question", null, 400);
    }

    // Auto-fix and validate options
    let cleanOptions;
    try {
      cleanOptions = validateAndParseOptions(ballot.options);
    } catch (err) {
      return error(res, err.message, null, 400);
    }

    const cleanBallot = {
      question: ballot.question.trim(),
      options: cleanOptions,
      ballot_type: ballot.ballot_type || "single_choice",
    };

    // ✅ DEBUG LOGGING
    console.log("🗳️ Ballot prepared for DB insert:");
    console.log("   Question:", cleanBallot.question);
    console.log("   Options (array):", cleanBallot.options);
    console.log(
      "   Options (stringified):",
      JSON.stringify(cleanBallot.options)
    );
    console.log("   Ballot type:", cleanBallot.ballot_type);

    // Validate ballot_type
    const validTypes = ["single_choice", "multi_choice"];
    if (!validTypes.includes(cleanBallot.ballot_type)) {
      return error(
        res,
        'Invalid ballot_type. Use "single_choice" or "multi_choice"',
        null,
        400
      );
    }

    const election = await createElection(user.id, {
      title: title.trim(),
      description: description ? description.trim() : null,
      context_type,
      start_time,
      end_time,
      ballot: cleanBallot,
    });

    await logEvent(
      user.id,
      "ELECTION_CREATED",
      {
        election_id: election.id,
        context: context_type,
        title: title.trim(),
      },
      req.clientIp
    );

    return success(
      res,
      { id: election.id, context_config: election.context_config },
      "Election created successfully",
      201
    );
  } catch (err) {
    console.error("Create election error:", err);
    if (err.message.includes("context")) {
      return error(res, "Invalid context type", err.message, 400);
    }
    if (
      err.message.includes("Start time") ||
      err.message.includes("End time")
    ) {
      return error(res, "Invalid election timing", err.message, 400);
    }
    return error(res, "Failed to create election", err.message, 500);
  }
}

// Get election by ID
async function getElectionController(req, res) {
  try {
    const { id } = req.params;
    const election = await getElectionById(id);
    if (!election) {
      return error(res, "Election not found", null, 404);
    }
    return success(res, election);
  } catch (err) {
    console.error("Get election error:", err);
    return error(res, "Failed to fetch election", err.message, 500);
  }
}

// List elections by context
async function listElectionsController(req, res) {
  try {
    const { context } = req.params;
    const validContexts = ["school", "board"];
    if (!validContexts.includes(context)) {
      return error(res, "Invalid context", null, 400);
    }
    const elections = await listElectionsByContext(context);
    return success(res, elections);
  } catch (err) {
    console.error("List elections error:", err);
    return error(res, "Failed to list elections", err.message, 500);
  }
}


/// NEW: Delete election (Admin only, only if no votes and not active/closed)
async function deleteElectionController(req, res) {
  try {
    const { id } = req.params;
    const { user } = req;

    if (user.role !== 'Admin') {
      return error(res, 'Only admins can delete elections', null, 403);
    }

    const election = await getElectionById(id);
    if (!election) {
      return error(res, 'Election not found', null, 404);
    }

    // Prevent deletion if votes exist or election is active/closed
    const voteCount = await knex('votes')
      .where({ ballot_id: election.ballot.id })
      .count('id as count')
      .first();
    
    if (election.status !== 'scheduled' || parseInt(voteCount.count) > 0) {
      return error(res, 'Cannot delete election with votes or non-scheduled status', null, 403);
    }

    await knex('elections').where({ id }).update({ is_active: false });
    await logEvent(user.id, 'ELECTION_DELETED', { election_id: id }, req.clientIp);
    return success(res, null, 'Election deleted');
  } catch (err) {
    return error(res, 'Failed to delete election', err.message, 500);
  }
}

module.exports = {
  createElectionController,
  getElectionController,
  listElectionsController,
  activateElectionController,
  closeElectionController,
  deleteElectionController,
};
