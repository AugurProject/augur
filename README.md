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

For most people, visiting the hosted [Augur client](http://client.augur.net) is enough to get started.

You still need to run ethereum locally; the client will walk you through setting it up.  For background, check out the Alpha [launch post](http://www.augur.net/blog/the-augur-alpha-is-now-available-to-download).

If you want to hack on Augur, or just really enjoy working at the terminal, use the following to set up.

### Building augur-client

Install [Node.js](https://nodejs.org/), then:

```
git clone https://github.com/AugurProject/augur-client.git
cd augur-client
git checkout develop
npm install -g grunt-cli
npm install
grunt browserify:build
```

### Running augur-client

`npm start`

[http://localhost:8080](http://localhost:8080)

### For development

use `grunt watchify` to have grunt watch for changes.  `grunt browserify:debug` for helpful (yet slow) module mappings in console.

*NOTE:*  a seperate dev branch is used when building in this manner and data will be seperate from the default build above.

## Contributing

We think Augur and Ethereum are pretty fascinating, and they're going to change the world. You should be a part of this.

We use [ZenHub](https://zenhub.io) to organize our GitHub issues. Find an issue in the To Do column that looks good, comment on it to let us know you want to tackle it, and we'll help you get it done.

Most discussions happen in our Slack, which has an IRC gateway in #augur on Freenode. You can ask for a Slack invite there, or stick with IRC if you prefer.
