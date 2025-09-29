/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("elections", (table) => {
    table.string("status").defaultTo("draft"); // draft, scheduled, active, closed
    table.timestamp("activated_at").nullable(); // when admin manually activated
    table.timestamp("closed_at").nullable(); // when admin manually closed
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("elections", (table) => {
    table.dropColumn("status");
    table.dropColumn("activated_at");
    table.dropColumn("closed_at");
  });
};
