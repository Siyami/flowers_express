'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.post('/customers', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('customers').insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hashed_password: hashed_password,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone,
        zipcode: req.body.zipcode
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
