# Augur | Local Node Configuration

This is for developers already familiar with the code repositories and want run a private local node and do end-to-end testing. It uses a docker container to upload smart contracts, point local augur-node and spin up augur client. The document will be organized into setup per layer, core, middleware and UI. Calls to execute smart contracts will be made through the middleware. 

## augur-core

After pulling down all the code. Well spin up a docker container that runs a local geth node. 

    docker-compose -f support/test/integration/docker-compose.yml up --abort-on-container-exit --build --force-recreate geth-dev-node

Verify the mapped ports, They should be, we are interested in HTTP: 47624 and ws: 47625 (ws isn't critical) 

    f6b4f100be73        augurproject/dev-node-geth:latest   "/start.sh"         5 minutes ago       Up 5 minutes        30303/tcp, 30303-30304/udp, 0.0.0.0:47624->8545/tcp, 0.0.0.0:47625->8546/tcp   integration_geth-dev-node_1

You'll need these environmental variables before uploading the contracts, copy paste them into your command-line (linux or mac):

    export ETHEREUM_HOST="localhost"
    export ETHEREUM_PORT="47624"
    export ETHEREUM_GAS_PRICE_IN_NANOETH="1"
    export ETHEREUM_PRIVATE_KEY="0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a"

Build augur-core    

    npm i; npx tsc; USE_NORMAL_TIME=false yarn build

Upload the contracts to the local docker node, it relies on the above environment variables

    USE_NORMAL_TIME=false node output/deployment/deployContracts.js


Now we need to make the reset of the system aware of the new contract address that were uploaded. Copy from and to, make sure to replace existing 12346 network:
### Note: 
augur-contracts repo is going to be merged into augur.js (TODO: update when that occurs, should be soon!)

    augur-core/output/contracts/addresses.json
    augur-contracts/addresses.json


## augur middleware

Since we are using local contracts we need to make sure all repositories are looking at the same dependencies, we're going to use yarn link to help us out. The following are examples, we'll execute in each repository section:

    -- yarn link stuff examples:
    in augur-contracts:> yarn link
    in augur.js:> npm i; yarn build; yarn link augur-contracts
    in augur.js:> yarn link
    in augur-node:> yarn link augur.js
    in augur (ui):> yarn link augur.js

### augur-contracts

Soon to be removed repository, this repository needs to be linked to augur.js

    cd augur-contracts
    yarn link

### augur.js

The helper scripts live in augur.js, both augur-node and augur (ui) repositories rely in augur.js. It needs to be built and link up augur-contracts (soon to be removed)  

    npm i; yarn build; yarn link augur-contracts

### augur-node

We will see ENDPOINT_HTTP and ENDPOINT_WS often it tells augur-node or augur.js scripts where to connect, make sure to yarn link augur.js

    cd augur-node
    yarn link augur.js
    npm run rebuild && ENDPOINT_HTTP=http://127.0.0.1:47624 ENDPOINT_WS=ws://127.0.0.1:47625 npm start


### augur (ui)

Only two things need to be done, update env-dev.json and make sure to yarn link. 

    cd augur
    yarn link augur.js
    yarn build
  	yarn dev


Example of the changed endpoints in the env-dev.json file

    "http": "http://127.0.0.1:47624",
    "ws": "ws://127.0.0.1:47625"


## Helper Scripts

There are a few helper node scripts in augur.js. There is the canned market scripts and individual task scripts. The default user noted by the private key has plenty of ETH but needs REP in order to create markets. The following scripts allow for getting REP, creating markets and showing created markets:


    cd augur.js
    
    ** give default user REP
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/rep-faucet.js
    
    ** create canned markets
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/canned-markets/create-markets.js
    
    ** verify end dates for markets
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 node scripts/helpers/expiring-markets.js



Here is a misc script to do operations on the local node and to change time. notice not all scripts need a `null` passed in, it is used for passing in a private key json file.

    ** change time
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/change-time.js null <unix timestamp>

    ** create open order
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a OUTCOME_TO_FILL=0 SHARES_TO_FILL=10 node scripts/helpers/create-simple-order.js null <market id> <buy | sell> <outcome> <num shares> <price>

    ** fill existing order
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/fill-market-order.js null <market id> <buy | sell> <outcome> <num shares>

    ** finialize market
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 node scripts/helpers/finalize-market.js <market id>

    ** do initial reporter
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/do-initial-report null <market id> <market outcome>

    ** confirm initial report 
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 node scripts/helpers/get-initial-report.js <market id>


TODO: added script for creating many user accounts and spreading around the ETH

## Summary

This should get the ball rolling
