const express = require('express');
const Transaction = require('../models/transaction');

const router = express.Router();

router.get('/', (req, res) => {
  Transaction
  // search by arbitrary fields
    .find(req.query).then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
