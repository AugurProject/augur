#!/bin/bash

set -ex

docker pull augurproject/dev-node-geth:latest
docker run -it -p 8545:8545 -p 8546:8546 -v $HOME/docker:/root/.ethereum augurproject/dev-node-geth:latest
