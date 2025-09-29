const knex = require('../../db/knexfile');
const logger = require('../../core/logger');

const logEvent = async (userId, eventType, details, ip) => {
  try {
    await knex('audit_logs').insert({
      user_id: userId,
      event_type: eventType, // e.g., 'VOTE_CAST', 'ELECTION_CREATED'
      details: JSON.stringify(details),
      ip_address: ip,
      created_at: new Date()
    });
  } catch (err) {
    logger.error('Failed to write audit log', { err, userId, eventType });
  }
};

module.exports = { logEvent };