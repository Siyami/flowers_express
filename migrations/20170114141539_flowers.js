'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('flowers', (table) => {
    table.increments();
    table.string('name').notNullable().defaultTo('');
    table.string('code').notNullable().defaultTo('');
    table.decimal('price', 5, 2).defaultTo(0);
    table.text('description').notNullable().defaultTo('');
    table.string('dimensions').notNullable().defaultTo('');
    table.string('picture_url_s').notNullable().defaultTo('');
    table.string('picture_url_l').notNullable().defaultTo('');
    table.string('page_url').notNullable().defaultTo('');
    table.string('cart_url').notNullable().defaultTo('');
    table.boolean('everyday').defaultTo(0);
    table.boolean('birthday').defaultTo(0);
    table.boolean('anniversary').defaultTo(0);
    table.boolean('love').defaultTo(0);
    table.boolean('get_well').defaultTo(0);
    table.boolean('new_baby').defaultTo(0);
    table.boolean('thank_you').defaultTo(0);
    table.boolean('sympathy').defaultTo(0);
    table.string('category').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('flowers');
};
