# Augur | Local Node Configuration

This is for developers already familiar with the code repositories and who want to run a private local node and do end-to-end testing.  
This process uses a docker container to upload the smart contracts, point to the local augur-node and spin up the augur client.  
The document is organized into setup per layer: augur.js (middleware), augur-node, and augur (UI).  
Calls to execute smart contracts are made through the middleware.

## Requirements

You'll need to clone the following repositories prior to starting:

* [augur.js](https://github.com/AugurProject/augur.js)
* [augur-node](https://github.com/AugurProject/augur-node)
* [augur](https://github.com/AugurProject/augur)
* node and npm installed
* yarn installed

If you know the versions of augur-node and augur ui use the same version of augur.js, then you can use the non-linking version [quick start](./dev-local-non-linking.md)


### Super easy quick start guide (UI development)

If you are only interested in augur UI development and want to start up local node and local augur-node, here is a super easy quick start guide [super quick start](./ui-dev-easy-start.md)



## Running Ethereum Local Node

If you are making changes to augur.js and want to link in augur-node and augur-ui then use the following method below.

There are two docker images available to host ethereum node locally:
* populated chain node (dev-pop-geth)
* blank chain node (dev-node-geth)


### populated with canned data
We have a pre-populated geth node docker image, it has the canned market data, the `deploy` has already been done for you, save lots of dev time.

There is a history of versions of populate node docker images based on the augur-core version, look in [docker hub](https://hub.docker.com/r/augurproject/dev-pop-geth/tags/)

Since the contracts have already been deploy the contract address are know, the :core-####### docker image will match the version of augur-core that augur.js has a package dependency.

If you are using a past version of the dev-pop-geth docker image you can get the contract addresses and upload block number with these commmands:
    
    #run in augur.js root 
    docker run --rm --entrypoint cat augurproject/dev-pop-geth:core-####### /augur.js/src/contracts/addresses.json > ./src/contracts/addresses.json
    docker run --rm --entrypoint cat augurproject/dev-pop-geth:core-####### /augur.js/src/contracts/upload-block-numbers.json > ./src/contracts/upload-block-numbers.json

where `core-######` is the version of the docker image ie. `core-0.13.0`. The above command puts the correct addresses so that augur-node and augur ui can use them when `yarn link augur.js` is used. See furthur down.


### blank chain geth node
After pulling down all the code we'll spin up a docker container that runs a local geth node:

    docker pull augurproject/dev-node-geth:latest
    docker run -it -p 8545:8545 -p 8546:8546 augurproject/dev-node-geth:latest

Since we are going to be uploading smart contracts locally we need to make sure both augur-node and augur (ui) repositories are looking at the same augur.js, we're going to use `yarn link` to help us out.

### augur.js

This this the main repo needed, there are helper scripts we can use. We'll run a local augur-node and augur (ui). These repositories rely on augur.js, they will need to be built and linked.

NOTE -- intentionally mixing the use of `npm` and `yarn` because `npm link` has exhibited issues.

    npm install
    npm run build
    yarn link
    npm run docker:geth:pop # (most popular way) start populated docker in the background
    npm run docker:geth:pop-normal-time # start a normal time docker image

### augur-node

We are going to use environment variables for convenience. ENDPOINT_HTTP and ENDPOINT_WS tell augur-node and augur.js scripts where to connect. Here we deploy smart contracts to our local node we started by the command above. The `npm explore augur.js -- npm run deploy:environment` does the deploy based on the environment variables. It will create/populate with markets and open orders. The ETHEREUM_PRIVATE_KEY specifies the market creater and owner of the open orders, the public address is 0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb. Import this address into MetaMask to see the markets and open orders.

    cd augur-node
    npm install
    yarn link augur.js

    # All of these keys are optional, and have the defaults listed here
    export USE_NORMAL_TIME="false"                # need to beable to change time manually
    export ETHEREUM_HOST="localhost"              # where the ethereum node is running
    export ETHEREUM_GAS_PRICE_IN_NANOETH="1"
    export ETHEREUM_HTTP=http://127.0.0.1:8545    # http endpoint scripts are going to use
    export ETHEREUM_WS=http://127.0.0.1:8546

    # default user wallet to use for scripts (0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb)
    export ETHEREUM_PRIVATE_KEY="fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a"


    # (ONLY NEEDED FOR BLANK NODE dev-node-geth docker image) 
    # Use dp to deploy to the configuration specified in your local environment (above)
    npx dp deploy

    # quick commmand to clean augur-node env and build and start
    npm run clean-start

### augur (ui)

Link augur.js:

    cd augur
    npm install
    yarn link augur.js

Start the augur development server:

    yarn dev


## Log In With MetaMask
If the MetaMask browser extension is installed, the correct network will need to be choosen. In the pull-down menu, select:

    localhost:8545

Use MetaMask to log in as different users, use the `Import Account` to paste in the private key of one of the existing accounts. This will automatically log in, and you should see lots and lotsGFlo of ETH.

Importing multiple accounts allows you to flip from one account to another, but you need to switch to the new user and sign out of MetaMask then back in and hard refresh augur UI.


## Helper Scripts

There are a few helper node scripts in augur.js. There is the canned market scripts and individual task scripts. The default user noted by the private key has plenty of ETH but needs REP in order to create markets. The following scripts allow for getting REP, creating markets and showing created markets:

There are eight user accounts baked into the docker node that have plenty of ETH:

    default user: 0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb
    private key: fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a

    ethereum addr: 0xbd355a7e5a7adb23b51f54027e624bfe0e238df6
    private key: 48c5da6dff330a9829d843ea90c2629e8134635a294c7e62ad4466eb2ae03712

    ethereum addr: 0xe4ec477bc4abd2b18225bb8cba14bf57867f082b
    private key: 8a4edfe30b4cdc9064b2e72d28bce9a650c24c6193de5058c96c296bc22d25d1

    ethereum addr: 0x40075b21ee1fc506207ac45c006d68114dae9967
    private key: a08bd4f8e835ba11f5236595f7162b894923422ee6e4ba53b6259699ecd02fa5

    ethereum addr: 0xd1a8d03498407db8299bc912ffc0196564fe91e9
    private key: ae95b6c42193f3f736ff91e19d19f1cb040672fe9144167c2e29ada17dc95b95

    ethereum addr: 0x5eb11f4561da21e9070b8f664fc70aec62ec29d5
    private key: d4cf6736518eaff819676c7822842d239f1b4e182dbfc0e40d735b8c20ab4ba9

    ethereum addr: 0x53c3d9be61c8375b34970801c5bd4d1a87860343
    private key: 705d7d3f7a0e35df37e80e07c44ccd6b8757c2b44d50cb2f33bc493cc07f65e7

    ethereum addr: 0x9d4c6d4b84cd046381923c9bc136d6ff1fe292d9
    private key: cfa5622e09afac03fb5dfa5cb54e52c9d37e06a5b07d5598850b62304639b815


To allow flexibility, the REP faucet can be run on which ever accounts you want REP. An example is below:

    cd augur.js

    ** give default user REP or change the ETHEREUM_PRIVATE_KEY value to give another user REP
    ETHEREUM_PRIVATE_KEY=48c5da6dff330a9829d843ea90c2629e8134635a294c7e62ad4466eb2ae03712 node scripts/dp rep-faucet environment

    ** create canned markets if not already created by the deploy script above.
    augur.js directory
    node scripts/dp create-markets environment

    ** verify end dates for markets
    node scripts/helpers/expiring-markets.js

    ** get account balance for user
    node scripts/helpers/get-account-balance.js 0x1fd9274a2fe0e86f5a7b5bde57b93c8c9b62e21d

For more information on the script tool [disco parrot](https://github.com/AugurProject/augur.js/tree/master/scripts/dp) (dp) in augur.js repository.

Here are misc. script to do operations on the local node and to change time. More scripts will be created as they are needed. Environment variables can be used or passed into the command like ETHEREUM_PRIVATE_KEY is in the examples below:

Note: for convenience create alias for `flash` 
    
    alias flash='node scripts/flash $*'

For changing time on the contracts, use flash in augur.js:

    ** create open order
    ETHEREUM_PRIVATE_KEY=fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/create-simple-order.js <market id> <buy | sell> <outcome> <num shares> <price>

    ** for creating a lot of `liquidity` on a market, it will create buy and sell orders for each outcome, starting at market minimum price increasing by 10% until market maximum price.
    ETHEREUM_PRIVATE_KEY=fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a node scripts/helpers/create-spread-orders.js <market id>

    ** fill existing order
    ETHEREUM_PRIVATE_KEY=48c5da6dff330a9829d843ea90c2629e8134635a294c7e62ad4466eb2ae03712 node scripts/helpers/fill-market-order.js <market id> <buy | sell> <outcome> <num shares>


There is a `augur.js` utility named `flash` to help with changing time and other sorted operations
    
A few caveats about pushing time: `augur-node` maintains a state machine, so once the time has been pushed to a certain market state that market can not go back. Time can be push and pulled, forward and backwards but know that once a block has been mined with a timestamp that changes the market state then that market can not go back:

    To get flash help and command names
    flash -h
    flash <command-name> -h

    Examples:
    ** change time
    flash push-timestamp -c 3 -d       # pushes time by adding 3 days
    flash set-timestamp -t 1525392001  # sets contract time to your local time

    ** do initial reporter
    flash designate-report -m <market id> -o <market outcome> 

    ** show initial report
    # shows if market has been reported on and gives details
    flash show-initial-reporter -m <market id>  

    ** finialize market
    # will push time so market can be finalized, needs initial report
    flash finalize-market -m <market id>  

    General helpers
    ** get account balances
    flash get-balance -a <account address>
    ** list market
    flash list-markets

    ** list market properties
    flash market-info -m <market id>

    ** there are more scripts, checkout flash -h

## Summary

This should get the ball rolling
