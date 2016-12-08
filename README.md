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

For those using [Yarn](https://yarnpkg.com/):
```
yarn
yarn build
```

For those using NPM:
```
npm install
npm run build
```

This will create a `build` folder inside of the `augur` directory with all the files necessary to run the client.  
Simply copy these files to your web server of choice.

## Develop

For those using [Yarn](https://yarnpkg.com/):
```
yarn dev
```

For those using npm:
```
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080)

## Run Ethereum Locally <a name="eth_local"></a>

## Documentation

[http://docs.augur.net](http://docs.augur.net)

## Development Tips

**#1: Search the project filenames for whatever you are looking for before thinking about it too much.**

Since our code is structured in many small files that are named the same as the state/functionality they represent, rather than try to follow and reverse engineer code paths, just blindly search all filenames for whatever it is you are looking for. More often than not, you will find what you need.

Want to know where the css for pagination is? Don't bother tracing where/how they're included, just search your files for `pag` >>>and `pagination.less` will pop up.

Want to see how the login account gets updated? Search the files for `login` >>> and `update-login-account.js` will appear.
