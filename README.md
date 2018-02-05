# Augur JavaScript API

[![Build Status](https://travis-ci.org/AugurProject/augur.js.svg?branch=master)](https://travis-ci.org/AugurProject/augur.js)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur.js/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur.js?branch=master)
[![npm version](https://badge.fury.io/js/augur.js.svg)](http://badge.fury.io/js/augur.js)

## Installation

```
npm install augur.js
```

## Usage

```javascript
var Augur = require("augur.js");
var augur = new Augur();

var ethereumNode = { http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546" };
var augurNode = "ws://127.0.0.1:9001";

augur.connect({ ethereumNode, augurNode }, (err) => {
  // do stuff
});
```

## Deployment

Deployment of Augur Contracts and Augur.js consists three or fourt steps. For production deploys, we will not perform the market data seeding step.

1. Contract Uploading - This is handled by the deployment code within the `augur-core` npm package. The deploy process handles uploading/versioning contracts and generating deployment artifacts.
2. Install Artifacts - Here we take the generated artifacts from (1) and wrap them into an Augur.js version, along with any necessary changes to augur.js to interface with the uploaded contracts.
3. Market Data Seeding - After installing the new deployment artifacts into augur.js after step (1), this happens only on non-production deploys.
4. Augur.js is bundled with the new deployment artifacts, and published to NPM

The first three of these steps can be handled by the included helper application `dp`. From within augur.js this can be started with as an npm script: `npm run dp`.


### `dp` Help Output:
```
%> npm run dp

> augur.js@4.7.0-61 dp /mnt/Volume-Home/home/pg/Development/augur/augur.js
> node scripts/augur-tool

+--------------------------------------+
| Augur Deployment a.k.a. Disco Parrot |
+--------------------------------------+
       \
        \     ▄▄▄▄▄▄▄▄
         \  ▄ ▄      ▄▄ ▄
          ▄ ▄            ▄
          ▄      ▄▄▄▄▄
         ▄               ▄ ▄
        ▄
                 ▄
                  ▄ ▄
         ▄        ▄ ▄      ▄▄ ▄
          ▄                   ▄▄ ▄
          ▄ ▄▄▄▄                 ▄▄ ▄
              ▄▄▄▄                  ▄▄
        ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀



Usage: dp <command> <network 1> <network 2> ... <network N>


Commands
create-markets, create-orders, deploy, rep-faucet, upload or help for this message

Networks
aura, clique, environment, rinkeby, ropsten

Configuration
Set the following environment variables to modify the behavior of the deployment process
ex: USE_NORMAL_TIME=false dp deploy aura

Network (when using 'environment' for the network)
ETHEREUM_HTTP        - The http(s) address of your ethereum endpoint (default: http://localhost:8545)
ETHEREUM_PRIVATE_KEY - HEX Private Key used for transactions on this eth node
GAS_PRICE_IN_NANOETH - The transaction gas price to use, specified in nanoeth (default: varies)

Private Keys (for any named environment)
AURA_PRIVATE_KEY     - Set the private key to use with the named network
CLIQUE_PRIVATE_KEY   -
RINKEBY_PRIVATE_KEY  -
ROPSTEN_PRIVATE_KEY  -

Upload Configs
PRODUCTION           - [true, false] If true force USE_NORMAL_TIME to true and potentially other
                     - optimizations. (default: false)
USE_NORMAL_TIME      - [true, false] Should time flow normally or be adjusted using the custom time
                     - management (default: true)
```

### Deploying to all testnets

## Documentation

[http://docs.augur.net](http://docs.augur.net)
