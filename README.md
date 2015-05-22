Augur Client
------------

[![Join the chat at https://gitter.im/AugurProject/augur-client](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/AugurProject/augur-client?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the frontend for [Augur](http://augur.net), a decentralized prediction market platform that runs on Ethereum.


## How Dapps Work

Ethereum Dapps store their data on the Ethereum blockchain, and their frontends are web pages that use the JavaScript API to access blockchain data.

* [Ethereum Development Tutorial](https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial)
* [Ethereum JavaScript API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
* [Dapps for Beginners](https://dappsforbeginners.wordpress.com/)

## Getting Started

### Running Ethereum

Install go-ethereum ([installation instructions](https://github.com/ethereum/go-ethereum/wiki)). Add a new account with `geth account new` and then start the client with `geth --rpc --rpccorsdomain 'http://localhost:8080'  --shh --unlock primary`.

### Building augur-client

Install [Node.js](https://nodejs.org/), then:

```
npm install -g grunt-cli
npm install
grunt browserify:build
```

### Running augur-client

`npm start`

[http://localhost:8080](http://localhost:8080)

### For development

use `grunt watchify` to have grunt watch for changes.  `grunt browserify:debug` for helpful (yet slow) module mappings in console.

## Features

- [ ] market commenting
- [ ] featured markets
- [ ] filters to organize markets by volume, category, number of traders, trading fee, initial liquidity
- [ ] api voting
- [ ] search engine for contract data / markets
- [ ] social media integrations
