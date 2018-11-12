const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  _id: String,
  from: String,
  to: String,
}, { versionKey: false });

module.exports = mongoose.model('Transaction', transactionSchema);
