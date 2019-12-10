#!/bin/bash

IMAGE=$1
DOCKER_TAG=${DOCKER_TAG:-$(node ./scripts/get-contract-hashes.js)};
./scripts/copy-docker-files.sh $IMAGE:$DOCKER_TAG
echo "Running Geth with contracts deployed from ${IMAGE}:${DOCKER_TAG}"
docker network inspect augur > /dev/null 2>&1 || docker network create augur

# stop geth if it is running already
docker ps | grep geth && docker stop geth
docker run --detach --init -e GETH_VERBOSITY=4 --rm -p 8545:8545 -p 8546:8546 --name ${CONTAINER_NAME:-geth} --network augur $IMAGE:$DOCKER_TAG

