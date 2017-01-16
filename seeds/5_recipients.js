'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('recipients').del()
    .then(() => {
      return knex('recipients').insert([{
        name: 'paul',
        institution: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        zipcode: ''
      }]);
    })
    .then(function() {
      return knex.raw(
        "SELECT setval('recipients_id_seq', (SELECT MAX(id) FROM recipients));"
      );
    });
};
