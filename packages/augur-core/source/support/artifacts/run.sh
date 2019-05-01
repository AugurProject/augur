#!/bin/bash

set -e

# generate abi.json
echo 'generating abi.json'
docker run --rm --entrypoint cat augurproject/augur-core:monorepo /augur/packages/augur-artifacts/build/abi.json > ../augur-artifacts/src/abi.json

# generate contracts.json'
echo 'generating contracts.json'
docker run --rm --entrypoint cat augurproject/augur-core:monorepo /augur/packages/augur-artifacts/build/contracts.json > ../augur-artifacts/src/contracts.json
