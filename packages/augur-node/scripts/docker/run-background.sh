#!/bin/bash

IMAGE=$1
TAG=core-$(node scripts/core-version.js)

docker run -it -d -e ETHEREUM_WS=${ETHEREUM_WS} --rm -p 9001:9001 -p 9002:9002 --name ${CONTAINER_NAME:-augur-node} $IMAGE:$TAG

