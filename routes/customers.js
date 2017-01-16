'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.post('/customers', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('customers').insert({
        email: req.body.email,
        hashed_password: hashed_password
      }, '*');
    })
    .then((customers) => {
      const customer = customers[0];

      delete customer.hashed_password;

      res.send(customer);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
