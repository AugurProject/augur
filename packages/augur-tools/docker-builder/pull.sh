#!/bin/bash

TAG=$(node ./scripts/get-image-id.js -n augurproject/dev-pop-geth-v2)
docker pull augurproject/dev-pop-geth-v2:$TAG

TAG=$(node ./scripts/get-image-id.js -n augurproject/dev-pop-normtime-geth-v2)
docker pull augurproject/dev-pop-normtime-geth-v2:$TAG

TAG=$(node ./scripts/get-image-id.js -n augurproject/dev-pop-geth-15-v2)
docker pull augurproject/dev-pop-geth-15-v2:$TAG
