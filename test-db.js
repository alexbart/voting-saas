const knex = require('knex');
const config = require('./knexfile');
const db = knex(config.development);

db.raw('SELECT NOW() as now')
  .then(() => console.log('✅ DB connected!'))
  .catch(err => console.error('❌ DB error:', err))
  .finally(() => db.destroy());