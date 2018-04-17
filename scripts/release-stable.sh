#!/bin/bash

version=$(date -u +%Y-%m-%d-%H%M)
docker build . --tag augurproject/augur-node:stable --tag augurprojet/augur-node:$version || exit 1

docker push augurproject/augur-node:$version || exit 1
docker push augurproject/augur-node:stable || exit 1
