# Augur | Local Node Configuration

This is for developers already familiar with the code repositories and who want to run a private local node and do end-to-end testing.  
This process uses a docker container to upload the smart contracts, point to the local augur-node and spin up the augur client.  
The document will be organized into setup per: layer, core, middleware, and UI.  
Calls to execute smart contracts will be made through the middleware.

## Requirements

You'll need to clone the following repositories prior to starting:

* [augur-core](https://github.com/AugurProject/augur-core)
* [augur-.js](https://github.com/AugurProject/augur.js)
* [augur](https://github.com/AugurProject/augur)

## augur-core

After pulling down all the code we'll spin up a docker container that runs a local geth node.

    docker-compose -f support/test/integration/docker-compose.yml up --abort-on-container-exit --build --force-recreate geth-dev-node

Verify the mapped ports. We are interested in the port mappings in following output via `docker ps`

    f6b4f100be73        augurproject/dev-node-geth:latest   "/start.sh"         5 minutes ago       Up 5 minutes        30303/tcp, 30303-30304/udp, 0.0.0.0:47624->8545/tcp, 0.0.0.0:47625->8546/tcp   integration_geth-dev-node_1

  * HTTP: 47624 maps to 8545
  * WS: 47625 (WS isn't critical) maps to 8546

You'll need these environmental variables before uploading the contracts.  
Copy/Paste them into your command-line (linux or mac):

    export ETHEREUM_HOST="localhost"
    export ETHEREUM_PORT="47624"
    export ETHEREUM_GAS_PRICE_IN_NANOETH="1"
    export ETHEREUM_PRIVATE_KEY="0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a"

Build augur-core    

    yarn i; npx tsc; USE_NORMAL_TIME=false yarn run build

Upload the contracts to the local docker node, it relies on the above environment variables

    USE_NORMAL_TIME=false node output/deployment/deployContracts.js


Now we need to make the reset of the system aware of the new contract address that were uploaded. Copy from and to, make sure to replace existing 12346 network:

    augur-core/output/contracts/addresses.json
    augur.js/src/contracts/addresses.json


## augur middleware

Since we are using local contracts we need to make sure all repositories are looking at the same dependencies, we're going to use yarn link to help us out.

### augur.js

The helper scripts live in augur.js, both augur-node and augur (ui) repositories rely on augur.js. It needs to be built and linked.

NOTE -- intentionally `npm i` here, as `yarn` has exhibited issues.

    npm i;
    yarn build;
    yarn link;

### augur-node

We will see ENDPOINT_HTTP and ENDPOINT_WS often it tells augur-node or augur.js scripts where to connect, make sure to yarn link augur.js

    cd augur-node
    yarn link augur.js
    yarn run rebuild && ENDPOINT_HTTP=http://127.0.0.1:47624 ENDPOINT_WS=ws://127.0.0.1:47625 yarn run start


### augur (ui)

Link augur.js:

    cd augur
    yarn
    yarn link augur.js;

Update the `env-dev.json` file to point to the local docker node:

```
...
  "ethereum-node": {
    "http": "http://127.0.0.1:47624",
    "ws": "ws://127.0.0.1:47625"
  },
...
```

Start the augur development server:

    yarn run dev

## Login with MetaMask
If MetaMask browser extension is install, it will need to be configured. Create custom RPC endpoint, same as the "http" url in the env-dev.json file

    http://127.0.0.1:47624

Use MetaMask to login as different users, use the `Import Account` to paste in the private key of one of the existing accounts. This will auto login and you should see lots and lots of ETH.

Importing multiple accounts allows you to flip from one account to another, but you need to switch to the new user and sign out of MetaMask then back in and hard refresh augur UI.


## Helper Scripts

There are a few helper node scripts in augur.js. There is the canned market scripts and individual task scripts. The default user noted by the private key has plenty of ETH but needs REP in order to create markets. The following scripts allow for getting REP, creating markets and showing created markets:

Also there are eight user accounts baked into the docker node that have plenty of ETH, Here is the list:

    default user: 0x1fd9274a2fe0e86f5a7b5bde57b93c8c9b62e21d
    private key: 0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a

    ethereum addr: 0xbd355a7e5a7adb23b51f54027e624bfe0e238df6
    private key: 0x48c5da6dff330a9829d843ea90c2629e8134635a294c7e62ad4466eb2ae03712

    ethereum addr: 0xe4ec477bc4abd2b18225bb8cba14bf57867f082b
    private key: 0x8a4edfe30b4cdc9064b2e72d28bce9a650c24c6193de5058c96c296bc22d25d1

    ethereum addr: 0x40075b21ee1fc506207ac45c006d68114dae9967
    private key: 0xa08bd4f8e835ba11f5236595f7162b894923422ee6e4ba53b6259699ecd02fa5

    ethereum addr: 0xd1a8d03498407db8299bc912ffc0196564fe91e9
    private key: 0xae95b6c42193f3f736ff91e19d19f1cb040672fe9144167c2e29ada17dc95b95

    ethereum addr: 0x5eb11f4561da21e9070b8f664fc70aec62ec29d5
    private key: 0xd4cf6736518eaff819676c7822842d239f1b4e182dbfc0e40d735b8c20ab4ba9

    ethereum addr: 0x53c3d9be61c8375b34970801c5bd4d1a87860343
    private key: 0x705d7d3f7a0e35df37e80e07c44ccd6b8757c2b44d50cb2f33bc493cc07f65e7

    ethereum addr: 0x9d4c6d4b84cd046381923c9bc136d6ff1fe292d9
    private key: 0xcfa5622e09afac03fb5dfa5cb54e52c9d37e06a5b07d5598850b62304639b815


To allow flexibility, the REP faucet can be run on which ever accounts you want REP, an example is below


    cd augur.js

    ** give default user REP
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/rep-faucet.js

    ** create canned markets
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/canned-markets/create-markets.js

    ** verify end dates for markets
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 node scripts/helpers/expiring-markets.js



Here is a misc script to do operations on the local node and to change time.

    ** change time
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/change-time.js <unix timestamp>

    ** create open order
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a OUTCOME_TO_FILL=0 SHARES_TO_FILL=10 node scripts/helpers/create-simple-order.js <market id> <buy | sell> <outcome> <num shares> <price>

    ** for creating a lot of `liquidity` on a market, it will create buy and sell orders for each outcome, starting at market minimum price increasing by 10% until market maximum price.
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/create-spread-orders.js <market id>

    ** fill existing order
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/fill-market-order.js <market id> <buy | sell> <outcome> <num shares>

    ** finialize market
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 node scripts/helpers/finalize-market.js <market id>

    ** do initial reporter
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 ETHEREUM_PRIVATE_KEY=0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/do-initial-report <market id> <market outcome>

    ** confirm initial report
    ETHEREUM_WS=http://127.0.0.1:47625 ETHEREUM_HTTP=http://127.0.0.1:47624 node scripts/helpers/get-initial-report.js <market id>

## Summary

This should get the ball rolling
