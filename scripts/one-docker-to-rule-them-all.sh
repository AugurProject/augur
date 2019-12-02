#!/bin/bash

set -euo pipefail

cleanup() {
  echo "stopping geth docker image"
  docker stop geth
}

trap cleanup SIGINT SIGTERM

# make sure we have the latest images
# (workaround until next version of docker supports the --pull flag)
docker pull augurproject/safe-relay-service_web:latest
docker pull 0xorg/mesh:0xV3

yarn docker:geth:pop
export CUSTOM_CONTRACT_ADDRESSES=`yarn --silent flash run get-all-contract-addresses --ugly | sed '1d'`
#yarn docker:gnosis
yarn workspace @augurproject/gnosis-relay-api run-relay

