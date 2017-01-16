'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('carts', (table) => {
    table.increments();
    table.integer('flower_id')
      .references('flowers.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.integer('order_id')
      .references('orders.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.string('daleveryDate')..notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('carts');
};
