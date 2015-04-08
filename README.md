Augur Client
------------

This is the frontend for [Augur](http://augur.net), a decentralized prediction market platform that runs on Ethereum.


## How Dapps Work

Ethereum Dapps store their data on the Ethereum blockchain, and their frontends are web pages that use the JavaScript API to access blockchain data.

* [Ethereum Development Tutorial](https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial)
* [Ethereum JavaScript API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
* [Dapps for Beginners](https://dappsforbeginners.wordpress.com/)


## Getting Started

### Building augur-client

Install [Node.js](https://nodejs.org/), then:

```
npm install -g grunt-cli
npm install
grunt browserify:build
```

To incrementally build on every save while you're developing, run `grunt watchify`.

### Running Ethereum

Install go-ethereum ([installation instructions](https://github.com/ethereum/go-ethereum/wiki)). Add a new account with `geth account new` and then start the client with `geth --rpc --rpcport 8080 --unlock primary`.

*or*

Install cpp-ethereum ([installation instructions](https://github.com/ethereum/cpp-ethereum/wiki)). Start the client with `eth -j`, which will enable the JSON-RPC interface on port 8080.

With either client running, you should now be able to load `augur/augur.html` in Chrome or Firefox.


## Features

- [ ] market commenting
- [ ] featured markets
- [ ] filters to organize markets by volume, category, number of traders, trading fee, initial liquidity
- [ ] api voting
- [ ] search engine for contract data / markets
- [ ] social media integrations
