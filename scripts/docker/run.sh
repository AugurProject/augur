#!/bin/bash

IMAGE=$1
TAG=core-$(node scripts/core-version.js)

echo "Running Geth with contracts deployed from augur-core@${TAG}"

docker run -e GETH_VERBOSITY=4 -it --rm -p 8545:8545 -p 8546:8546 --name ${CONTAINER_NAME:-geth-node} $IMAGE:$TAG

