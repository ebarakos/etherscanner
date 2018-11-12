const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
  _id: String,
  balance: String,
  transactions: [{ type: String }],
}, { versionKey: false });

module.exports = mongoose.model('Account', accountSchema);
