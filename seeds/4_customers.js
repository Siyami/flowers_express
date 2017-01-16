/* eslint max-len: ["error", 1000]*/

'use strict';

exports.seed = function(knex) {
  return knex('customers').del()
    .then(() => {
      return knex('customers').insert([{
        id: 1,
        email: '2pac@shakur.com',
        hashed_password: '$2a$12$LaKBUi8mCFc/9LiCtvwcvuNIjgaq9LJuy/NO.m4P5.3FP8zA6t2Va',
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
