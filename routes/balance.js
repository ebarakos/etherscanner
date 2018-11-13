const express = require('express');
const Account = require('../models/account');

const router = express.Router();

router.get('/:address', async (req, res) => {
  try {
    const acc = await Account.find({ _id: req.params.address });
    if (acc[0] === undefined) (res.status(300).json({ message: 'account not found' }));
    res.status(200).json({ balance: acc[0].balance });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
