#!/bin/bash

set -e

environment=$1
shift

case "$environment" in
  "docker")
    docker run --rm -it \
      --env-file <(env | grep "PRIVATE_KEY\|TRAVIS\|TOKEN") \
      -e DEPLOY \
      -e ARTIFACTS \
      --entrypoint "node"  \
      augurproject/augur-core:monorepo -- /augur/packages/augur-core/output/deployment/deployNetworks.js $@
    ;;
  "direct")
    echo "Deploying to $@"
    node -r ts-node/register ./src/deployment/deployNetworks.ts $@
    ;;
  *)
    echo "Must specifiy either docker or direct as first argument"
    exit 1
    ;;
esac

