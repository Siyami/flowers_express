'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.claim = payload;

    next();
  });
};

router.get('/order/:id', authorize, (req, res, next) => {
  knex('orders')
    .innerJoin('flowers', 'flowers.id', 'orders.flower_id')
    .where('carts.customer_id', req.claim.userId)
    .orderBy('id', 'ASC')
    .then((rows) => {
      const cart = camelizeKeys(rows);

      res.send(cart);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/order', (req, res, next) => {
  let { flower_id, flowerCode, flowerPrice, deliveryDate, customer_id, recipient_id } = req.body;
  flower_id = parseInt(flower_id);
  customer_id = parseInt(customer_id);

  const orderIP = req.ip;
  console.log(flowerPrice);

  if (!deliveryDate || !deliveryDate.trim()) {
    return next(boom.create(400, 'You should choose delivery date'));
  }
  if (!flowerPrice) {
    return next(boom.create(400, 'Price must be exist'));
  }

  const insertCart = { flower_id, flowerCode, flowerPrice, deliveryDate, customer_id, orderIP, recipient_id };
  knex('orders')
    .insert((insertCart), '*')
    .then((items) => {
      res.send(items[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/order/:id', authorize, (req, res, next) => {
  const cardMessage = req.body.cardMessage;
  const recipient = req.body.recipient_id;

  knex('orders')
    .where('id', req.params.id)
    .first()
    .then ((order) => {
      if (!order) {
        return next();
      }
      return knex('orders')
        .update({ cardMessage, recipient }, '*')
        .where('id', req.params.id)
        .first();
      })
    .then((orders) => {
      res.send(orders[0]);
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
