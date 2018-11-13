# Etherscanner

Store and retrieve Ethereum balances and transactions for certain addresses.



## Install

You need to setup mongoUrl and etherscanAPIkey to an .env file in root folder.

`npm install`

`npm run start`



## API


### GET /sync/:address

Store info for an address

Example: `/sync/0xAddress`


### GET /transactions/

Retrieve stored transactions. 

Optional filter by the following query params: ***from***, ***to***, ***value***, ***blockNumber*** 

Example: `/transactions?from=0xAddressAto=0xAddressB`


### GET /balance/:address

Retrieve balance of an address.

Example: `/balance/0xAddress`