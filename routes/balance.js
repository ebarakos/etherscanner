const express = require('express');
const Account = require('../models/account');

const router = express.Router();

router.get('/:address', (req, res) => {
  Account
    .find(
      { _id: req.params.address },
    ).then((result) => {
      console.log(result);
      res.status(200).json({ balance: result[0].balance });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
