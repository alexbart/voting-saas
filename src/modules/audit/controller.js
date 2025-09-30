// src/modules/audit/controller.js
const { success, error } = require('../../core/responses');
const knex = require('../../db/knexfile');

async function getAuditLogs(req, res) {
  try {
    // Only admins can view audit logs
    if (req.user.role !== 'Admin') {
      return error(res, 'Access denied', null, 403);
    }

    const logs = await knex('audit_logs')
      .leftJoin('users', 'audit_logs.user_id', 'users.id')
      .select(
        'audit_logs.id',
        'audit_logs.event_type',
        'audit_logs.details',
        'audit_logs.ip_address',
        'audit_logs.created_at',
        'users.email as user_email',
        'users.name as user_name'
      )
      .orderBy('audit_logs.created_at', 'desc')
      .limit(100);

    return success(res, logs);
  } catch (err) {
    return error(res, 'Failed to fetch audit logs', err.message, 500);
  }
}

module.exports = { getAuditLogs };