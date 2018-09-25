#!/bin/bash

IMAGE=augurproject/augur-node
TAG=core-$(node scripts/core-version.js)
docker push $IMAGE:$TAG
docker push $IMAGE:dev
