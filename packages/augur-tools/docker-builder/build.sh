#!/bin/bash
set -Eeuxo pipefail

# Make sure you're up to date
#docker pull augurproject/dev-node-geth:latest
MONO_ROOT=../../
CONTRACT_SHA=$(scripts/get-contract-hashes.js)
# Build and copy to merge with current address.json/upload-block-numbers.json
IMAGE_NAME=augurproject/dev-pop-geth-v2
docker build --no-cache=true -f docker-builder/Dockerfile --build-arg normal_time=false --build-arg network_id=102 -t $IMAGE_NAME $MONO_ROOT
scripts/copy-docker-files.sh $IMAGE_NAME
docker tag $IMAGE_NAME $IMAGE_NAME:$CONTRACT_SHA

# Build and copy to merge with updated address.json/block_numbers.json
IMAGE_NAME=augurproject/dev-pop-normtime-geth-v2
docker build --no-cache=true -f docker-builder/Dockerfile --build-arg normal_time=true --build-arg network_id=103 -t $IMAGE_NAME $MONO_ROOT
scripts/copy-docker-files.sh $IMAGE_NAME
docker tag $IMAGE_NAME $IMAGE_NAME:$CONTRACT_SHA

# Build and copy to merge with current address.json/block_numbers.json
IMAGE_NAME=augurproject/dev-pop-geth-15-v2
docker build --no-cache=true -f docker-builder/Dockerfile --build-arg normal_time=false --build-arg network_id=104 --build-arg period_time=15 -t $IMAGE_NAME $MONO_ROOT
scripts/copy-docker-files.sh $IMAGE_NAME
docker tag $IMAGE_NAME $IMAGE_NAME:$CONTRACT_SHA
