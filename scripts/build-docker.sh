#!/bin/bash

TAG=$(npm view augur-core version)
docker build --no-cache . -t augurproject/dev-pop-geth:core-$TAG -t augurproject/dev-pop-geth:latest
docker run --rm --entrypoint cat augurproject/dev-pop-geth:core-$TAG /augur.js/src/contracts/addresses.json > ./src/contracts/addresses.json
docker push augurproject/dev-pop-geth:core-$TAG
docker push augurproject/dev-pop-geth:latest
