#!/bin/bash

TAG=$(npm view augur-core version)
docker build --no-cache . -t augurproject/dev-pop-geth:core-$TAG -t augurproject/dev-pop-geth:latest
./scripts/copy-docker-files.sh
docker push augurproject/dev-pop-geth:core-$TAG
docker push augurproject/dev-pop-geth:latest
