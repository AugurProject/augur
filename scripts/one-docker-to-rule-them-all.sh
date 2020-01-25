#!/bin/bash

set -euo pipefail

cleanup() {
  echo "stopping geth docker image"
  docker kill geth
  yarn workspace @augurproject/gnosis-relay-api kill-relay
}

trap cleanup SIGINT SIGTERM

# true true will give you uploaded contracts and time controlled
DEV="${1-false}"
FAKE="${2-false}"

# make sure we have the latest images
# (workaround until next version of docker supports the --pull flag)
docker pull augurproject/safe-relay-service_web:latest
docker pull 0xorg/mesh:latest

echo "Deploy contracts: $DEV"
echo "Use fake time: $FAKE"
# run docker image, creating or updating local-addresses.json
if [ "$DEV" == "true" ]; then
  yarn workspace @augurproject/tools docker:geth:detached

  if [ "$FAKE" == "true" ]; then
    echo "using fake time deploy"
    yarn flash run fake-all
  else
    echo "using normal deploy"
    yarn flash run normal-all
  fi

else
  echo "running normal pop"
  yarn docker:geth:pop
fi

# pick up the creation of / changes to local-addresses.json
yarn build

# In dev mode, also create canned markets
if [ "$DEV" == "true" ]; then
  yarn flash run create-canned-markets
fi

# run docker ecosystem with variables derived from geth node
export ETHEREUM_CHAIN_ID=`yarn --silent flash run network-id | sed '1d'`
export CUSTOM_CONTRACT_ADDRESSES=`yarn --silent flash run get-all-contract-addresses --ugly | sed '1d'`
export GNOSIS_SAFE_CONTRACT_ADDRESS=`yarn --silent flash run get-contract-address -n GnosisSafe | sed '1d'`
export PROXY_FACTORY_CONTRACT_ADDRESS=`yarn --silent flash run get-contract-address -n ProxyFactory | sed '1d'`
#yarn docker:gnosis
yarn workspace @augurproject/gnosis-relay-api run-relay

