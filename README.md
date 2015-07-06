Augur Client
------------

This is the frontend for [Augur](http://augur.net), a decentralized prediction market platform that runs on Ethereum.

## How Dapps Work

Ethereum Dapps store their data on the Ethereum blockchain, and their frontends are web pages that use the JavaScript API to access blockchain data.

* [Ethereum Frontier Guide](http://ethereum.gitbooks.io/frontier-guide/content/)
* [Ethereum Development Tutorial](https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial)
* [Ethereum JavaScript API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
* [Ethereum Wiki](https://github.com/ethereum/wiki/wiki)
* [Ethereum Builders](http://ethereum.builders/) ([YouTube Channel](https://www.youtube.com/channel/UCYlXQeVJ__t7T5kgHWhhiXQ))
* [State of the Dapps](https://docs.google.com/spreadsheets/d/1VdRMFENPzjL2V-vZhcc_aa5-ysf243t5vXlxC2b054g/edit#gid=0), a spreadsheet of Dapps in development

## Getting Started

The client is built and hosted at [http://client.augur.net](http://client.augur.net)

You still need to run ethereum locally; the client will walk you through platform specific installation instructions. Alternatively, If you want to hack on Augur, or just really enjoy working at the terminal, you can following the "Building the augur-client" instructions below.

### Running Ethereum

Install [go-ethereum](https://github.com/ethereum/go-ethereum/wiki). 

Add a new account with 
```
geth account new
``` 
and then start the client with 
```
geth --rpc --rpccorsdomain 'http://client.augur.net' --shh --unlock 0 console
```

### Building the augur-client

Install [Node.js](https://nodejs.org/).

```
git clone https://github.com/AugurProject/augur-client.git
cd augur-client
git checkout develop
npm install -g grunt-cli
npm install
grunt browserify:build
```

Start the local web server

`npm start`

[http://localhost:8080](http://localhost:8080)

### Notes for development

use `grunt watchify` to have grunt watch for changes.  `grunt browserify:debug` for helpful (yet slow) module mappings in console.

also, a seperate dev branch is used when building in this manner and data will be seperate from the default build and hosted option above.

## Contributing

We think Augur and Ethereum are pretty awesome, and they're going to change the world. You encourage you to be a part of this.

We use [ZenHub](https://zenhub.io) to organize our GitHub issues. Find an issue in the To Do column that looks good, comment on it to let us know you want to tackle it, and we'll help you get it done.

Most discussions happen in our Slack, which has an IRC gateway in #augur on Freenode. You can ask for a Slack invite there, or stick with IRC if you prefer.
