'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const request = require('superagent');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/apiRequest', (req, res, next) => {
  const zipCode = req.body.zip;
  request.get(`https://www.floristone.com/api/rest/flowershop/checkdeliverydate?zipcode=${zipCode}`)
    .set('Authorization', process.env.API_KEY)
    .end((err, data) => {
      if (err) {
        return next(boom.create(403, 'Unauthorized API request'));
      }
        res.send(data.body);
    })
});


module.exports = router;
