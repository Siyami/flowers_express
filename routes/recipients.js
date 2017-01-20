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
  let {
    customer_id, name, institution, address1, address2, city, state,
    country, phone, zipcode
  } = req.body;
  customer_id = parseInt(customer_id);

  const insertRecipient = {
    customer_id, name, institution, address1, address2, city, state,
    country, phone, zipcode
  };

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
        .insert(insertRecipient, '*');
    })
    .then((recipients) => {
      res.send(recipients[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
