# augur | client
[![Build Status](https://travis-ci.org/AugurProject/augur.svg?branch=seadragon)](https://travis-ci.org/AugurProject/augur)
[![Coverage Status](https://coveralls.io/repos/github/AugurProject/augur/badge.svg?branch=seadragon)](https://coveralls.io/github/AugurProject/augur?branch=seadragon)

Augur is a decentralized prediction market platform built on Ethereum.  
It runs locally in your browser and communicates directly with the ethereum network, without going through intermediate servers.

There are several ways to run it:

* Easiest: **visit [dev.augur.net](http://dev.augur.net)**  
* Best: [run ethereum locally](#eth_local)

## Requirements
[Git](https://git-scm.com/)  
[Node](https://nodejs.org/) or [Docker](https://www.docker.com/)

*A Note to Windows 10 Users:*  
Turn on `Developer Mode` and also enable `Windows Subsystem For Linux` so that you have access to bash.  
Run all subsequent commands within the bash command prompt.  
It's also recommend that you use a Debian based workflow for the installation of packages (makes things much easier).

## Build From Source

```
git clone https://github.com/AugurProject/augur.git
cd augur
```

### NPM
```
npm i
npm run build
```

### [Yarn](https://yarnpkg.com/)
```
yarn
yarn build
```

### [Docker](https://www.docker.com/)
```
docker build -t augur .
```

This will create a `build` folder inside of the `augur` directory with all the files necessary to run the client.
Simply copy these files to your web server of choice.

## Develop

### NPM
```
npm i
npm run dev
```

### [Yarn](https://yarnpkg.com/)
```
yarn
yarn dev
```

### [Docker](https://www.docker.com/)
To run augur ui in docker map your external port (8080) to docker container port 80
```
docker run -p 8080:80 augur
```

Visit [http://localhost:8080](http://localhost:8080)


## Run Ethereum Locally <a name="eth_local"></a>

There are a number of ways to go about running an Ethereum local node against Augur, described below is the CLI method using [geth](https://github.com/ethereum/go-ethereum/wiki/geth).

Start off by [installing geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum).

Depending on how you'll be running Augur (Development OR Production), follow the corresponding steps below:

*NOTE --* Unless you have a specific reason for doing so, generally you should not simultaneously run geth and another Ethereum client (such as Mist or Parity).

See more detail notes to run augur UI on local ethereum node and augur-node [dev-local-node](https://github.com/AugurProject/augur/blob/seadragon/docs/dev-local-node.md)

### Development -- Testnet (Rinkeby)

Create an Ethereum account (if needed):
```
geth --rinkeby account new
```
Be sure to securely store your password and remember the account address (displayed after account creation).

Start geth:  
```
geth --rinkeby --unlock 0 --rpc --ws --rpcapi eth,net,shh,admin,txpool,web3,personal --wsapi eth,net,shh,web3,admin,txpool,personal --rpccorsdomain '*' --wsorigins '*' --cache 2048 console
```

Additional points of note:  
* The value supplied to `--unlock` should correspond to the account you'd like to be using for Augur transactions.  
  * To get a list of accounts and their numerical value run `geth account list`.

### Production -- Main Network

Important note: the Augur contracts have **not** yet been uploaded to the live Ethereum network, and therefore Augur is not yet available on the mainnet.  The following instructions are here as a placeholder for when our contracts are uploaded to the mainnet.

Create an Ethereum account (if needed):
```
geth --rinkeby account new
```
Be sure to securely store your password and remember the account address (displayed after account creation).

Start geth:  
**Important** -- The following command will be using **real Eth (Main Network)** and is potentially more permissive than necessary for your use case.  
**DO** educate yourself surrounding the arguments and determine which are appropriate for your specific use case.
```
geth --unlock 0 --rpc --ws --rpcapi eth,net,shh,admin,txpool,web3,personal --wsapi eth,net,shh,web3,admin,txpool,personal --rpccorsdomain '<domain of server>' --wsorigins '<domain of server>' --cache 2048 console
```

**Testing local geth node**

    curl --data '{"method":"net_version","params":[],"id":67,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545

    returns network id: should be 4 for rinkeby
    {"jsonrpc":"2.0","id":67,"result":"4"}

Additional resources:  
[JSON RPC API Documentation](https://github.com/ethereum/wiki/wiki/JSON-RPC)  
[Javascript Console](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console#web3)  

Additional points of note:
* The value supplied to `--unlock` should correspond to the account you'd like to be using for Augur transactions.  
  * To get a list of accounts and their numerical value run `geth account list`.
* The values supplied to `--rpccorsdomain` and `--wsorigins` should correspond to the server's domain which is running the instance of Augur.  **BE SPECIFIC + DO NOT USE A WILDCARD**

## Documentation

[http://docs.augur.net](http://docs.augur.net)


## Development Tips

**#1: Search the project filenames for whatever you are looking for before thinking about it too much.**

Since our code is structured in many small files that are named the same as the state/functionality they represent, rather than try to follow and reverse engineer code paths, just blindly search all filenames for whatever it is you are looking for. More often than not, you will find what you need.

Want to know where the css for pagination is? Don't bother tracing where/how they're included, just search your files for `pag` >>>and `pagination.less` will pop up.

Want to see how the login account gets updated? Search the files for `login` >>> and `update-login-account.js` will appear.

## Sponsorships

[![BrowserStack](/src/assets/images/browser-stack.png?raw=true "BrowserStack")](https://www.browserstack.com/)

As an open source project, we'd like to thank [BrowserStack](https://www.browserstack.com/) for providing free access to their environment testing platform!
