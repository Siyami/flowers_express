'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('recipients', (table) => {
    table.increments();
    table.integer('customer_id')
      .references('customers.id')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.string('name').notNullable().defaultTo('');
    table.string('institution').notNullable().defaultTo('');
    table.string('address1').notNullable().defaultTo('');
    table.string('address2').notNullable().defaultTo('');
    table.string('city').notNullable().defaultTo('');
    table.string('state').notNullable().defaultTo('');
    table.string('country').notNullable().defaultTo('');
    table.string('phone').notNullable().defaultTo('');
    table.integer('zipcode').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recipients');
};
