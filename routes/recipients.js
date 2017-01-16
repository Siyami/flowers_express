'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/recipients', (_req, res, next) => {
  knex('recipients')
    .orderBy('id')
    .then((recipients) => {
      res.send(recipients);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/recipients/:id', (req, res, next) => {
  knex('recipients')
    .where('id', req.params.id)
    .first()
    .then((recipient) => {
      if (!recipient) {
        return next();
      }

      res.send(recipient);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/recipients', (req, res, next) => {
  knex('customers')
    .where('id', req.body.customer_id)
    .first()
    .then((customer) => {
      if (!customer) {
        const err = new Error('customer_id does not exist');

        err.status = 400;

        throw err;
      }

      return knex('recipients')
        .insert({
          customer_id: req.body.customer_id,
          name: req.body.name,
          institution: req.body.institution,
          address1: req.body.address1,
          address2: req.body.address2,
          city: req.body.city,
          state: req.body.state,
          country: req.body.country,
          phone: req.body.phone,
          zipcode: req.body.zipcode,
        }, '*');
    })
    .then((recipients) => {
      res.send(recipients[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
