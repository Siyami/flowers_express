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


const app = express();

app.disable('x-powered-by');

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join('public')));

app.use(customers);
app.use(token);
app.use(flowers);
app.use(recipients);
app.use(orders);
app.use(carts);


app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res
      .status(err.status)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
