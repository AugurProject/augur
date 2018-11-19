#!/bin/bash
set -e

# Make sure you're up to date
docker pull augurproject/dev-node-geth:latest

# Build and copy to merge with current address.json/block_numbers.json
IMAGE_NAME=augurproject/dev-pop-geth
BRANCH_NAME=master #$(git symbolic-ref --short HEAD)
MONO_ROOT=../../

docker build --no-cache -f docker-builder/Dockerfile --build-arg normal_time=false --build-arg network_id=102 -t $IMAGE_NAME:$BRANCH_NAME $MONO_ROOT
../scripts/copy-docker-files.sh $IMAGE_NAME:$BRANCH_NAME 

# Build and copy to merge with updated address.json/block_numbers.json
#IMAGE_NAME=augurproject/dev-pop-normtime-geth
#docker build --no-cache . --build-arg normal_time=true --build-arg network_id=103 -t $IMAGE_NAME:$TAG -t $IMAGE_NAME:latest
#./scripts/copy-docker-files.sh $IMAGE_NAME:latest

# Build and copy to merge with current address.json/block_numbers.json
#IMAGE_NAME=augurproject/dev-pop-geth-15
#docker build --no-cache . --build-arg normal_time=false --build-arg network_id=104 --build-arg period_time=15 -t $IMAGE_NAME:$TAG -t $IMAGE_NAME:latest
#./scripts/copy-docker-files.sh $IMAGE_NAME:latest

