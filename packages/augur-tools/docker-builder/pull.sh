#!/bin/bash

TAG=$(node ./scripts/get-contract-hashes.js)
docker pull augurproject/dev-pop-geth-v2:$TAG
docker pull augurproject/dev-pop-normtime-geth-v2:$TAG
docker pull augurproject/dev-pop-geth-15-v2:$TAG
