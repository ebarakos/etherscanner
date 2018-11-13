const express = require('express');
const Transaction = require('../models/transaction');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tx = await Transaction.find(req.query);
    res.status(200).json(tx);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
