// src/modules/auth/service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../../db/knexfile');

const JWT_SECRET = process.env.JWT_SECRET || 'voting-saas-secret-change-in-prod';

// src/modules/auth/service.js (ADD this function)
async function registerUser(userData) {
  const { name, email, password, role, context_type, external_id } = userData;

  // Validate role & context
  const validContexts = ['school', 'board'];
  const validRoles = {
    school: ['Admin', 'Teacher', 'Student', 'Candidate'],
    board: ['Admin', 'Shareholder', 'Candidate']
  };

  if (!validContexts.includes(context_type)) {
    throw new Error('Invalid context_type');
  }
  if (!validRoles[context_type].includes(role)) {
    throw new Error(`Invalid role for ${context_type}`);
  }

  // Check email uniqueness
  const existing = await knex('users').where({ email }).first();
  if (existing) {
    throw new Error('Email already registered');
  }

  const hashed = await bcrypt.hash(password, 10);
  const [id] = await knex('users').insert({
    name,
    email,
    password_hash: hashed,
    role,
    context_type,
    external_id: external_id || null,
    is_active: true,
  }).returning('id');

  return id;
}

async function loginUser(email, password) {
  const user = await knex('users').where({ email, is_active: true }).first();
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid ? user : null;
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, context: user.context_type },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { registerUser, loginUser, generateToken };