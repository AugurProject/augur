#!/bin/bash

IMAGE=augurproject/augur-node
TAG=$(node ./scripts/get-contract-hashes.js)
docker push $IMAGE:$TAG
docker push $IMAGE:dev
