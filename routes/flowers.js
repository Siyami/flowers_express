'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const boom = require('boom');
const knex = require('../knex');

router.get('/flowers', (_req, res, next) => {
  knex('flowers')
    .orderBy('id')
    .then((flowers) => {
      res.send(flowers);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/flowers/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (!id || id < 0) {
    return next(boom.create(404, 'Not Found'));
  }

  knex('flowers')
    .where('id', id)
    .first()
    .then((flower) => {
      if (!flower) {
        throw boom.create(404, 'Not Found');
      }
      res.send(flower);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/flowers/categories/:val', (req, res, next) => {
  const catOfFlower = req.params.val;
  console.log(catOfFlower);
  knex('flowers').where(`${catOfFlower}`, true)
    .then((data) => {
      if (!data) {
        throw boom.create(404, 'Not Found');
      }
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/flowers/categories/nav/:val', (req, res, next) => {
  const catOfFlower = req.params.val;
  console.log(catOfFlower);

  knex('flowers')
    .where('category', 'like', `${catOfFlower}%`)
    .then((data) => {
      if (!data) {
        throw boom.create(404, 'Not Found');
      }
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
