'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000;

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const customers = require('./routes/customers');
const token = require('./routes/token');
const carts = require('./routes/carts');
const flowers = require('./routes/flowers');
const recipients = require('./routes/recipients');
const orders = require('./routes/orders');
const apiRequest = require('./routes/apiRequest');


const app = express();

app.disable('x-powered-by');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join('public')));

app.use(customers);
app.use(token);
app.use(flowers);
app.use(recipients);
app.use(orders);
app.use(carts);
app.use(apiRequest);


app.use((_req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res.status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
