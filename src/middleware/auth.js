// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { error } = require('../core/responses');

const JWT_SECRET = process.env.JWT_SECRET || 'voting-saas-secret-change-in-prod';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Access token required', null, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, context }
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', null, 401);
  }
};

module.exports = authMiddleware;