#!/bin/bash

trap "exit" INT
set -e

ETHEREUM_PASSWORD="$(cat ../ethereum-nodes/geth-poa/password.txt)" scripts/decrypt-keystore.js "../ethereum-nodes/geth-poa/keys/dev-key.json"
