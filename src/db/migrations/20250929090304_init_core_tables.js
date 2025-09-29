/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('email').unique();
      table.string('phone');
      table.string('external_id'); // e.g., student_id, shareholder_id
      table.string('role').notNullable(); // 'Admin', 'Student', etc.
      table.string('context_type').notNullable(); // 'school', 'board'
      table.string('password_hash');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('elections', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('title').notNullable();
      table.text('description');
      table.string('context_type').notNullable(); // 'school', 'board'
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time').notNullable();
      table.boolean('is_active').defaultTo(true);
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('ballots', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('election_id').references('id').inTable('elections').onDelete('CASCADE');
      table.string('question').notNullable();
      table.jsonb('options').notNullable(); // e.g., ["Alice", "Bob"]
      table.string('ballot_type').defaultTo('single_choice'); // single_choice, multi_choice
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('votes', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('ballot_id').references('id').inTable('ballots').onDelete('CASCADE');
      table.uuid('voter_id').references('id').inTable('users').onDelete('CASCADE');
      table.jsonb('selection').notNullable(); // e.g., "Alice" or ["Option1", "Option2"]
      table.integer('weight').defaultTo(1); // for weighted voting
      table.timestamp('cast_at').defaultTo(knex.fn.now());
      table.unique(['ballot_id', 'voter_id']); // prevent double voting
    })
    .createTable('audit_logs', (table) => {
      table.increments('id').primary();
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
      table.string('event_type').notNullable(); // e.g., 'VOTE_CAST'
      table.jsonb('details');
      table.string('ip_address');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('votes')
    .dropTableIfExists('ballots')
    .dropTableIfExists('elections')
    .dropTableIfExists('audit_logs')
    .dropTableIfExists('users');
};
