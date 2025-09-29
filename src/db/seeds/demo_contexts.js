/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // No DB table for contexts (we use static templates), but we can seed a demo user
  await knex('users').del();
  await knex('users').insert([
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Admin User',
      email: 'admin@school.edu',
      role: 'Admin',
      context_type: 'school',
      password_hash: '$2b$10$Wx3r5JzKZ6e6U8x9X0Y1ZuO1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p', // dummy hash
      is_active: true,
    },
  ]);
};