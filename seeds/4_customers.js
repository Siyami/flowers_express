/* eslint max-len: ["error", 1000]*/

'use strict';

exports.seed = function(knex) {
  return knex('customers').del()
    .then(() => {
      return knex('customers').insert([{
        id: 1,
        first_name: 'siyami',
        last_name: 'avci',
        email: 'siyamiavci@gmail.com',
        hashed_password: '$2a$12$LaKBUi8mCFc/9LiCtvwcvuNIjgaq9LJuy/NO.m4P5.3FP8zA6t2Va',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        zipcode: 98005,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));"
      );
    });
};


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
    table.string('zipcode').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};
