# augur | client
[![Build Status](https://travis-ci.org/AugurProject/augur.svg?branch=master)](https://travis-ci.org/AugurProject/augur)
[![Coverage Status](https://coveralls.io/repos/github/AugurProject/augur/badge.svg?branch=master)](https://coveralls.io/github/AugurProject/augur?branch=master)

Augur is a decentralized prediction market platform built on Ethereum.  
It runs locally in your browser and communicates directly with the ethereum network, without going through intermediate servers.

There are several configurations to run it on testnet:

* Easiest: **visit [dev.augur.net](http://dev.augur.net)**  
* Partial Local: [run ethereum client locally](#partial-local-)
* Full Local: [run everything locally](#run-everything-locally-)
* Development Environment Setups: [various configurations](https://github.com/AugurProject/augur/blob/master/docs/dev-local-node.md)

Production: 

There is an electron app that contains augur-node and augur UI. This app allows the user to point to testnets and mainnet. [Augur App](https://github.com/AugurProject/augur-app). It is a faster way to interact with mainnet because augur-node is local. Enjoy!
***

## Rinkeby Ethereum Account

In the following configurations we use rinkeby testnet, here is how to get an account:

* You also can use Metamask to create a rinkeby account (easiest)
  After you install Metamask web browser plugin, you can change the Network to Rinkeby and choose the `create account` menu option

* Download geth and create rinkeby account
  (download geth)[https://www.ethereum.org/cli]
  (geth account commands)[https://github.com/ethereum/go-ethereum/wiki/Managing-your-accounts]
  ```
  geth --rinkeby account new
  ```
  After putting in your passphrase you will get your address. You can get your secret/private key and import into metamask and connect to augur UI. Location of keystore file depends on os. ie. ~/Library/Ethereum/rinkeby/keystore/<'UTC--timestamp--account hash'>. This file can be used to extract private key. Instructions are beyond the scope of this readme.

***

## Easiest:

### Overview

We are hosting the UI for testnets, dev.augur.net points to rinkeby ethereum testnet node
Simply point your web browser to  [dev.augur.net](http://dev.augur.net)

***

## Partial Local <a name="eth_local"></a>

### Overview
We'll run the UI locally and use the rinkeby augur-node. We will build and host the UI locally and use the same env.json configuration as the 'Easiest' section.

### Requirements
* [Git](https://git-scm.com/)
* [Node](https://nodejs.org/)
* [Docker](https://www.docker.com/)

*A Note to Windows 10 Users:*  
Turn on `Developer Mode` and also enable `Windows Subsystem For Linux` so that you have access to bash.  
Run all subsequent commands within the bash command prompt.  
It's also recommend that you use a Debian based workflow for the installation of packages (makes things much easier).

## Build From Source

```
git clone https://github.com/AugurProject/augur.git
cd augur
```

### npm
```
npm i
npm run build
```

### [yarn](https://yarnpkg.com/)
```
yarn
yarn build
```

This will create a `build` folder inside of the `augur` directory with all the files necessary to run the client.
Simply copy these files to your web server of choice.


### [Docker](https://www.docker.com/)
After git cloning UI source let docker build UI and create a docker image. Then run the docker container (from just built image) that will host augur UI locally and usings rinkeby augur-node and rinkeby ethereum node
[dockerized augur client](./docs/deploy-production.md)

***

## Run everything Locally <a name="totally_local"></a>
These instructions go through running local ethereum node, augur-node and augur UI. This will create a local environment contracts loaded with canned data.

Full instructions are here [dev-local-node](https://github.com/AugurProject/augur/blob/seadragon/docs/dev-local-node.md)



# Additional resources:  
[JSON RPC API Documentation](https://github.com/ethereum/wiki/wiki/JSON-RPC)  
[Javascript Console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console#web3)  


## Documentation

[http://docs.augur.net](http://docs.augur.net)


## Contributing

We use Clubhouse.io for our issue tracker. If you would like to contribute, please join us on Discord (https://discordapp.com/invite/JwEtX9P) and provide us with your email address so we can grant you access to our Clubhouse.


## Development Tips

### #1: Search the project filenames for whatever you are looking for before thinking about it too much.

Since our code is structured in many small files that are named the same as the state/functionality they represent, rather than try to follow and reverse engineer code paths, just blindly search all filenames for whatever it is you are looking for. More often than not, you will find what you need.

Want to know where the css for pagination is? Don't bother tracing where/how they're included, just search your files for `pag` >>>and `pagination.less` will pop up.

Want to see how the login account gets updated? Search the files for `login` >>> and `update-login-account.js` will appear.


## #2: Verify endpoints the UI is connected to

To verify the ethereum node and augur-node the UI is connected see the Configuration at:  `http://localhost:8080/config/env.json`




## Sponsorships

[![BrowserStack](/src/assets/images/browser-stack.png?raw=true "BrowserStack")](https://www.browserstack.com/)

As an open source project, we'd like to thank [BrowserStack](https://www.browserstack.com/) for providing free access to their environment testing platform!
