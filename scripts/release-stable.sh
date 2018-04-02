#!/bin/bash

version=$(date -u +%Y-%m-%d-%H%M)
docker build . --tag augurproject/augur:stable --tag augurprojet/augur:$version || exit 1

docker push augurproject/augur:$version
docker push augurproject/augur:stable

