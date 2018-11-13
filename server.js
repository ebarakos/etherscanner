const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactions');
const balanceRoutes = require('./routes/balance');
const syncRoutes = require('./routes/sync');

require('dotenv').config();

const api = express();

const port = process.env.PORT || 3000;

api.listen(port);

mongoose.connect(
  process.env.mongoUrl,
);

api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

api.use('/transactions', transactionRoutes);
api.use('/balance', balanceRoutes);
api.use('/sync', syncRoutes);


api.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

api.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = api;
