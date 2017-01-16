'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('carts', (table) => {
    table.increments();
    table.integer('flower_id')
      .references('flowers.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.string('price').notNullable().defaultTo('');
    table.integer('customer_id')
      .references('customers.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.string('total').defaultTo(0);
    table.string('deliveryDate').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('carts');
};
