'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('orders', (table) => {
    table.increments();
    table.integer('flower_id')
      .references('flowers.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.string('flowerCode').notNullable().defaultTo('');
    table.string('flowerPrice').notNullable().defaultTo('');
    table.string('deliveryDate').notNullable().defaultTo('');
    table.text('cardMessage').defaultTo('');
    table.string('specialInstruction').notNullable().defaultTo('');
    table.integer('recipient_id')
      .references('recipients.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.integer('customer_id')
      .references('customers.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.string('orderIP').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};
