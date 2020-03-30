#!/bin/bash
set -Eeuxo pipefail

export DOCKER_BUILDKIT=1

MONO_ROOT=../../
CONTRACT_SHA=$(scripts/get-contract-hashes.js)
#IMAGE_NAME=augurproject/dev-pop-geth-v2
#docker build --progress=plain --no-cache=true -f docker-builder/Dockerfile --build-arg normal_time=false --build-arg network_id=102 -t $IMAGE_NAME $MONO_ROOT
#docker tag $IMAGE_NAME $IMAGE_NAME:$CONTRACT_SHA

IMAGE_NAME=augurproject/dev-pop-normtime-geth-v2
docker build --progress=plain --no-cache=true -f docker-builder/Dockerfile --build-arg normal_time=true --build-arg network_id=103 -t $IMAGE_NAME $MONO_ROOT
docker tag $IMAGE_NAME $IMAGE_NAME:$CONTRACT_SHA

#IMAGE_NAME=augurproject/dev-pop-geth-15-v2
#docker build --progress=plain --no-cache=true -f docker-builder/Dockerfile --build-arg normal_time=false --build-arg network_id=104 --build-arg period_time=15 -t $IMAGE_NAME $MONO_ROOT
#docker tag $IMAGE_NAME $IMAGE_NAME:$CONTRACT_SHA
