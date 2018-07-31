#!/bin/bash

TAG=core-$(node scripts/core-version.js)
docker push augurproject/dev-pop-geth:$TAG
docker push augurproject/dev-pop-geth:latest
docker push augurproject/dev-pop-normtime-geth:$TAG
docker push augurproject/dev-pop-normtime-geth:latest
