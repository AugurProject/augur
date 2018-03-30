#!/bin/bash

TAG=$(npm view augur-core version)
docker push augurproject/dev-pop-geth:core-$TAG
docker push augurproject/dev-pop-geth:latest
docker push augurproject/dev-pop-normtime-geth:core-$TAG
docker push augurproject/dev-pop-normtime-geth:latest
