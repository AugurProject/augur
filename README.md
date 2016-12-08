# Augur | Reference Client
[![Build Status](https://travis-ci.org/AugurProject/augur.svg?branch=master)](https://travis-ci.org/AugurProject/augur)
[![Coverage Status](https://coveralls.io/repos/github/AugurProject/augur/badge.svg?branch=master)](https://coveralls.io/github/AugurProject/augur?branch=master)

Augur is a decentralized prediction market platform built on Ethereum.  
It runs locally in your browser and communicates directly with the ethereum network, without going through intermediate servers.

There are several ways to run it:

* Easiest: **visit [app.augur.net](http://app.augur.net)**  
* Balanced: **one-click azure install (coming soon)**
* Best: [run ethereum locally](#eth_local)

## Build From Source

Install [Node.js](https://nodejs.org/), then:

```
git clone https://github.com/AugurProject/augur.git
cd augur
```

For those using NPM:
```
npm install
npm run build
```

For those using [Yarn](https://yarnpkg.com/):
```
yarn
yarn build
```

This will create a `build` folder inside of the `augur` directory with all the files necessary to run the client.  
Simply copy these files to your web server of choice.

## Develop

For those using npm:
```
npm run dev
```

For those using [Yarn](https://yarnpkg.com/):
```
yarn dev
```

Visit [http://localhost:8080](http://localhost:8080)

## Run Ethereum Locally <a name="eth_local"></a>

There are a number of ways to go about running an Ethereum local node against Augur, described below is the CLI method using [geth](https://github.com/ethereum/go-ethereum/wiki/geth).

Start off by [installing geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum).

Depending on how you'll be running Augur (Development OR Production), follow the corresponding steps below:

### Development -- Testnet (Morden)

Create an Ethereum account (if needed):
```
geth --testnet account new
```
Be sure to securely store your password and account address (displayed after account creation).

Start geth:  
```
geth --testnet --unlock 0 --rpc --ws --rpcapi eth,net,shh,admin,txpool,web3,personal --wsapi eth,net,shh,web3,admin,txpool,personal --rpccorsdomain '*' --wsorigins '*' --cache 2048 console
```
Some points of note:
The value supplied to `--unlock` should correspond to the account you'd like to be using for Augur transactions.  
To get a list of accounts and their numerical value run `geth account list`.

### Production -- Main Network
Create an Ethereum account (if needed):
```
geth account new
```

Start geth:  
```
geth --unlock 0 --rpc --ws --rpcapi eth,net,shh,admin,txpool,web3,personal --wsapi eth,net,shh,web3,admin,txpool,personal --rpccorsdomain '<domain of server>' --wsorigins '<domain of server>' --cache 2048 console
```
**Important** -- The above command will be using **real Eth (Main Network)** and is potentially more permissive than necessary for your use case.  **DO** educate yourself surrounding the above arguments and determine which are appropriate for your specific use case.

Some additional resources:
[JSON RPC API Documentation](https://github.com/ethereum/wiki/wiki/JSON-RPC)
[Javascript Console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console#web3)

Some additional points of note:
* The value supplied to `--unlock` should correspond to the account you'd like to be using for Augur transactions.  
  * To get a list of accounts and their numerical value run `geth account list`.
* The values supplied to `--rpccorsdomain` and `--wsorigins` should correspond to the server's domain which is running the instance of Augur.

## Documentation

[http://docs.augur.net](http://docs.augur.net)

## Development Tips

**#1: Search the project filenames for whatever you are looking for before thinking about it too much.**

Since our code is structured in many small files that are named the same as the state/functionality they represent, rather than try to follow and reverse engineer code paths, just blindly search all filenames for whatever it is you are looking for. More often than not, you will find what you need.

Want to know where the css for pagination is? Don't bother tracing where/how they're included, just search your files for `pag` >>>and `pagination.less` will pop up.

Want to see how the login account gets updated? Search the files for `login` >>> and `update-login-account.js` will appear.
