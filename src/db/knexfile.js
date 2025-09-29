// src/db/knex.js
const knexConfig = require('../../knexfile');
const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];
const knex = require('knex')(config);

module.exports = knex;