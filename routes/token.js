'use strict';

const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys } = require('humps');

const router = express.Router();

router.post('/token', (req, res, next) => {
  let customer;
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }
  if (!password || !password.trim()) {
    return next(boom.create(400, 'Password must not be blank'));
  }

  knex('customers')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad email or password');
      }

      customer = camelizeKeys(row);

      return bcrypt.compare(password, customer.hashedPassword);
    })
    .then(() => {
      const claim = { customerId: customer.id };
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        secure: router.get('env') === 'production'
      });

      delete customer.hashedPassword;

      res.send(customer);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/token', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return res.send(false);
    }

    res.send({ id: payload.customerId });

  });
});

router.delete('/token', (req, res) => {
  res.clearCookie('token');
  res.end();
});

module.exports = router;
