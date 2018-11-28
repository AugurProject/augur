#!/bin/bash

set -e

docker run --rm --entrypoint cat augurproject/augur-core:latest /app/output/contracts/abi.json > ../augur-artifacts/abi.json
docker run --rm --entrypoint cat augurproject/augur-core:latest /app/output/contracts/contracts.json > ../augur-artifacts/contracts.json
