const express = require('express');
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

api.use('/transactions', transactionRoutes);
api.use('/balance', balanceRoutes);
api.use('/sync', syncRoutes);

module.exports = api;
