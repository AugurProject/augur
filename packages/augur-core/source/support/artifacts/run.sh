#!/bin/bash

set -e

# generate abi.json
echo 'generating abi.json'
docker run --rm --entrypoint cat augurproject/augur-core:latest /app/output/contracts/abi.json > ../augur-artifacts/abi.json

# generate contracts.json'
echo 'generating contracts.json'
docker run --rm --entrypoint cat augurproject/augur-core:latest /app/output/contracts/contracts.json > ../augur-artifacts/contracts.json
