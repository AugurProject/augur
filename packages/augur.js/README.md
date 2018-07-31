# Augur JavaScript API

[![Build Status](https://travis-ci.org/AugurProject/augur.js.svg?branch=master)](https://travis-ci.org/AugurProject/augur.js)
[![Coverage Status](https://coveralls.io/repos/AugurProject/augur.js/badge.svg?branch=master&service=github)](https://coveralls.io/github/AugurProject/augur.js?branch=master)
[![npm version](https://badge.fury.io/js/augur.js.svg)](http://badge.fury.io/js/augur.js)

## Installation

To install augur.js in your project, add it as a dependency:
```
npm install --save-exact augur.js
```

To develop augur.js, deploy contracts and publish it, make sure you've installed its dev dependencies
```
augur.js$ npm install
```

## Usage

```javascript
var Augur = require("augur.js");
var augur = new Augur();

var ethereumNode = { http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546" };
var augurNode = "ws://127.0.0.1:9001";

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  // do stuff
});
```

## Deployment

Deployment of Augur Contracts and Augur.js consists three or four steps. For production deploys, we will not perform step 3 "Market Data Seeding."

1. Contract Uploading - This is handled by the deployment code within the `augur-core` npm package. The deploy process handles uploading/versioning contracts and generating deployment artifacts.
2. Install Artifacts - Here we take the generated artifacts from (1) and wrap them into an Augur.js version, along with any necessary changes to augur.js to interface with the uploaded contracts.
3. Market Data Seeding - After installing the new deployment artifacts into augur.js after step (1), this happens only on non-production deploys.
4. Augur.js is bundled with the new deployment artifacts, and published to NPM

The first three of these steps can be handled by the included helper application `dp`. From within augur.js this can be started with as an npm script: `npm run dp`.


### `dp` Help Output:
```
augur.js$ node scripts/dp                                                                                                                                                                                                                                                                                                   8.7.0    16:21
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
AURA_PRIVATE_KEY     - Override key used to deploy to Aura, defaults to the dev key
CLIQUE_PRIVATE_KEY   - Override key used to deploy to Clique, defaults to the dev key
RINKEBY_PRIVATE_KEY  - Set key used to deploy to Rinkeby, default is blank and will error if not set
ROPSTEN_PRIVATE_KEY  - Set key used to deploy to Ropsten, default is blank and will error if not set

Upload Configs
PRODUCTION           - [true, false] If true force USE_NORMAL_TIME to true and potentially other
                     - optimizations. (default: false)
USE_NORMAL_TIME      - [true, false] Should time flow normally or be adjusted using the custom time
                     - management (default: true)
```

### Deploying to all testnets

#### Contract Uploads
To deploy all testnets, we will use `dp` to perform steps 1-3 above, and `npm release` to perform step 4.

To begin, to deploy multiple networks at once, simply list them after the command being invoked. This will sequentially perform the command on the named networks.

#### Deploy Configuration

The contract uploading stage has some possible configurations. For `aura` and `clique` networks, the private key used to perform the deploys has a hardcoded default of augur's dev key. To deploy to Rinkeby or Ropsten, you must configure an environment variable to contain the private key.

For Augur team members, the Rinkeby and Ropsten private keys are available in our Keybase repository under "keys". Export RINKEBY_PRIVATE_KEY to contain the hex value to use it in the deploy process.
```
augur.js$ export RINKEBY_PRIVATE_KEY=$(cat $HOME/dev/keys/deploy_keys/rinkeby.prv)
```

Running the deployment process is as simple as invoking `dp` with the names of the networks we want to deploy. This will perform a contract upload, create test markets, and create test orders for those markets.
```
augur.js$ node scripts/dp deploy aura clique rinkeby
```

#### Releasing Augur.js
After this succeeds for each market, your local tree will be updated with new contract addresses, and starting block numbers. These files are by default placed in the right spot of the source tree: `src/contracts/addresses.json` and `src/contracts/upload-block-numbers.json`.

After testing augur.js works with augur-node and augur-ui (guides will be provided in their respective repositories), it is time to create a new NPM package version for augur.js.

While in development, we want to increment pre-release versions of augur.js, and publish it to the @dev tag on NPM, while on production we will update a major, minor, or patch number and publish to @latest. Helpers for this process are defined as npm scripts:

```
npm run release:dev
npm run release:patch
npm run release:minor
rpm run release:major
```

These helper scripts will ensure that the version has been updated and build artifacts have been created in dist, and git tags have been pushed to origin.

To begin, commit the new deployment artifacts changes to your augur.js repository:

```
augur.js$ git add src/contracts/{addresses,upload-block-numbers}.json
augur.js$ git commit -m 'Bumping augur.js deployment to new contract uploads'
```

then, run release on augur.js to publish it to the world:

```
augur.js$ npm run release:dev
```

To perform this NPM update, you must have access to the augurproject NPM repository.


### Summary (Example Full Deploy, to a new version of augur-core)

```
augur.js$ npm install --save-exact augur-core@latest
augur.js$ git add package.json package-lock.json
augur.js$ RINKEBY_PRIVATE_KEY=$(cat $HOME/dev/key/deploy_keys.prv) node scripts/dp deploy aura clique rinkeby
augur.js$ git add src/contracts/{address,upload-block-numbers}.json
augur.js$ git commit -m 'Bumping contracts to new deploy for updated augur-contracts'
augur.js$ npm run release:dev
```

## NPM commands of interest

This command is used to build pre-populated docker image and push to [docker hub](https://hub.docker.com/r/augurproject/dev-pop-geth/tags/). the image is tagged with`:latest` and with the version of augur-core used. ie `core-0.12.2`, see scripts/build-docker.sh for more details.
* npm run docker:build



## Documentation

[http://docs.augur.net](http://docs.augur.net)
