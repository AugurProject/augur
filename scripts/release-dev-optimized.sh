#!/bin/bash

set -euxo pipefail

version=$(date -u +%Y-%m-%d-%H%M)
docker build . --build-arg ethereum_network=rinkeby --build-arg build_environment=dev-optimized --tag augurproject/augur:dev-optimized

docker push augurproject/augur:dev-optimized

