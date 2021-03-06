'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('customers', (table) => {
    table.increments();
    table.string('first_name').notNullable().defaultTo('');
    table.string('last_name').notNullable().defaultTo('');
    table.string('email').unique().notNullable();
    table.specificType('hashed_password', 'char(60)').notNullable();
    table.string('address1').notNullable().defaultTo('');
    table.string('address2').notNullable().defaultTo('');
    table.string('city').notNullable().defaultTo('');
    table.string('state').notNullable().defaultTo('');
    table.string('country').notNullable().defaultTo('');
    table.string('phone').notNullable().defaultTo('');
    table.string('zipcode').notNullable().default('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('customers');
};
