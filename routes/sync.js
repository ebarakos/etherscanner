const express = require('express');
const axios = require('axios');
const Transaction = require('../models/transaction');
const Account = require('../models/account');

require('dotenv').config();

const router = express.Router();

const axiosInstance = axios.create({
  baseURL: 'http://api.etherscan.io/api?module=account&sort=asc&',
});

router.get('/:address', (req, res) => {
  // TODO: need to move code below into another file?
  // TODO: maybe use async await? need to resolve all promises before sending back info

  axiosInstance.get(`&action=balance&address=${req.params.address}&apikey=${process.env.etherscanAPIkey}`)
    .then((response) => {
      Account
        .findOneAndUpdate(
          { _id: req.params.address },
          {
            $set:
            {
              address: req.params.address,
              balance: response.data.result,
            },
          },
          { upsert: true, new: true },
        )
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((error) => {
      console.log(error);
    });
  axiosInstance.get(`&action=txlist&address=${req.params.address}&apikey=${process.env.etherscanAPIkey}`)
    .then((response) => {
      console.log(response.data.result);
      const resp = [];
      Account
        .findOneAndUpdate(
          { _id: req.params.address },
          {
            $set:
              { address: req.params.address, transactions: response.data.result.map(tx => tx.hash) },
          },
          { upsert: true, new: true },
        )
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < response.data.result.length; i++) {
        const transaction = new Transaction({
          _id: response.data.result[i].hash,
          from: response.data.result[i].from,
          to: response.data.result[i].to,
          blockNumber: response.data.result[i].blockNumber,
          value: response.data.result[i].value,
        });
        transaction
          .save()
          .then((result) => {
            console.log(result);
            resp.push({
              tx_hash: `${response.data.result[i].hash}`,
              message: 'stored transaction info',
              storedTransaction: result,
            });
          })
          .catch((err) => {
            console.log(err);
            // error code for _id that exists
            if (err.errmsg.startsWith('E11000')) {
              resp.push({
                tx_hash: `${response.data.result[i].hash}`,
                message: 'already stored',
              });
            } else {
              resp.push({
                tx_hash: `${response.data.result[i].hash}`,
                error: err,
              });
            }
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });

  // res.status(200).send(resp);
  res.status(200).json({ message: 'synced' });
});

module.exports = router;
