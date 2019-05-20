#!/bin/bash

IMAGE=$1
TAG=$(node ./scripts/get-contract-hashes.js)
./scripts/copy-docker-files.sh $IMAGE:$TAG
echo "Running Geth with contracts deployed from ${IMAGE}:${TAG}"
docker run -e GETH_VERBOSITY=4 -it --rm -p 8545:8545 -p 8546:8546 --name ${CONTAINER_NAME:-geth-node} $IMAGE:$TAG

