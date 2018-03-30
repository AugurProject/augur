#!/bin/bash

TAG=$(npm view augur-core version)

# Build and copy to merge with current address.json/block_numbers.json
IMAGE_NAME=augurproject/dev-pop-geth
docker build --no-cache . --build-arg normal_time=false --build-arg network_id=22346 -t $IMAGE_NAME:core-$TAG -t $IMAGE_NAME:latest
./scripts/copy-docker-files.sh $IMAGE_NAME:latest

IMAGE_NAME=augurproject/dev-pop-normtime-geth
# Build and copy to merge with updated address.json/block_numbers.json
docker build --no-cache . --build-arg normal_time=true --build-arg network_id=32346 -t $IMAGE_NAME:core-$TAG -t $IMAGE_NAME:latest
./scripts/copy-docker-files.sh $IMAGE_NAME:latest

