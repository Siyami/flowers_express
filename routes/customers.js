/* eslint max-len: ["error", 200]*/
'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/customers', (req, res, next) => {
  const {
    email, password
  } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Password must be at least 8 characters'));
  }

  knex('customers')
    .where('email', email)
    .first()
    .then((customer) => {
      if (customer) {
        throw boom.create(400, 'Email already exists');
      }

      return bcrypt.hash(req.body.password, 12)
    })

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

      const claim = {
        user_id: customer.id
      };
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days' // Adds an expiration field to the payload
      });

      res.cookie('token', token, { // cookie is at the header
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // lives 7 days, if you don't include expires after you log out
        secure: router.get('env') === 'production' // forces the token only be sent as https
      });

      delete customer.hashed_password;

      res.send(customer);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
