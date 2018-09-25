#!/bin/bash

ETHEREUM_PRIVATE_KEY=$(cat ../keys/deploy_keys/rinkeby.prv) AUGUR_WS=ws://127.0.0.1:9001 ETHEREUM_WS=ws://127.0.0.1:8546 ETHEREUM_HTTP=http://127.0.0.1:8545 scripts/dp/fill-order.js
# ETHEREUM_PASSWORD=$(cat ~/.rinkeby/.password) AUGUR_WS=ws://127.0.0.1:9001 ETHEREUM_WS=ws://127.0.0.1:8546 ETHEREUM_HTTP=http://127.0.0.1:8545 scripts/dp/fill-order.js ~/.rinkeby/keystore/UTC--2017-11-19T22-11-05.040818570Z--95f75c360c056cf4e617f5ba2d9442706d6d43ed
