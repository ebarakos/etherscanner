const express = require('express');
const axios = require('axios');
const Transaction = require('../models/transaction');
const Account = require('../models/account');

require('dotenv').config();

const router = express.Router();

const axiosInstance = axios.create({
  baseURL: 'http://api.etherscan.io/api?module=account&sort=asc&',
});

router.get('/:address', async (req, res) => {
  const resp = [];
  try {
    const response = await axiosInstance.get(`&action=balance&address=${req.params.address}&apikey=${process.env.etherscanAPIkey}`);
    await Account
      .findOneAndUpdate(
        { _id: req.params.address },
        {
          $set:
          {
            balance: response.data.result,
          },
        },
        { upsert: true, new: true },
      );
    resp.push({
      account: `${req.params.address}`,
      message: 'stored balance for this account',
    });
  } catch (err) {
    resp.push({
      error: err,
    });
  }
  try {
    const response = await axiosInstance.get(`&action=txlist&address=${req.params.address}&apikey=${process.env.etherscanAPIkey}`)
    try {
      await Account
        .findOneAndUpdate(
          { _id: req.params.address },
          {
            $set:
              { transactions: response.data.result.map(tx => tx.hash) },
          },
          { upsert: true, new: true },
        );
      resp.push({
        account: `${req.params.address}`,
        message: 'stored transactions for this account',
      });
    } catch (err) {
      resp.push({
        error: err,
      });
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const tx of response.data.result) {
      const transaction = new Transaction({
        _id: tx.hash,
        from: tx.from,
        to: tx.to,
        blockNumber: tx.blockNumber,
        value: tx.value,
      });
      try {
        // eslint-disable-next-line no-await-in-loop
        await transaction.save();
        resp.push({
          tx: `${tx.hash}`,
          message: 'stored transaction',
        });
      } catch (err) {
        // error code for _id that exists
        if (err.errmsg.startsWith('E11000')) {
          resp.push({
            tx: `${tx.hash}`,
            message: 'already stored',
          });
        } else {
          resp.push({
            tx: `${tx.hash}`,
            error: err,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(resp);
});

module.exports = router;
