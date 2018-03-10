#!/bin/bash

ETHEREUM_PRIVATE_KEY=$(cat ../keys/deploy_keys/rinkeby.prv) ETHEREUM_WS=ws://127.0.0.1:8546 ETHEREUM_HTTP=http://127.0.0.1:8545 scripts/dp/create-markets.js
