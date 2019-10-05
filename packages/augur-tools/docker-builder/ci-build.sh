#!/bin/bash
set -exuo pipefail

NETWORK_ID='12346'
NORMAL_TIME='true'

PARAMS=""
while (( "$#" )); do
  case "$1" in
    -n|--network-id)
      NETWORK_ID="$2"
      shift 2
      ;;
    -t|--normal-time)
      NORMAL_TIME="$2"
      shift 2
      ;;
    --) # end argument parsing
      shift
      break
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
    *) # preserve positional arguments
      PARAMS="$PARAMS $1"
      shift
      ;;
  esac
done
# set positional arguments in their proper place
eval set -- "$PARAMS"

BUILD_IMAGE=$1

export NETWORK_ID="${NETWORK_ID}"
export USE_NORMAL_TIME="${NORMAL_TIME}"
export ETHEREUM_HTTP=http://localhost:8545
export ETHEREUM_WS=http://localhost:8546
docker run --init --rm --env NETWORK_ID="${NETWORK_ID}" --env NORMAL_TIME="${NORMAL_TIME}" --env PERIOD_TIME=5 --rm --name dev-node-geth -d augurproject/dev-node-geth:latest
docker cp dev-node-geth:/geth geth
docker stop dev-node-geth
find geth
rm -f geth/chain/geth.ipc
docker run -v `pwd`/geth:/geth-deploy --init --rm --env ROOT=/geth-deploy --env NETWORK_ID="${NETWORK_ID}" --env NORMAL_TIME="${NORMAL_TIME}" --env PERIOD_TIME=5 -p 8545:8545 -p 8546:8546 --name pop-geth-deploy --detach augurproject/dev-node-geth:latest
yarn workspace @augurproject/tools flash run deploy --write-artifacts
yarn workspace @augurproject/tools build
yarn workspace @augurproject/tools flash run faucet --amount 10000000000000000000
yarn workspace @augurproject/tools flash run rep-faucet --amount 100000
yarn workspace @augurproject/tools flash run create-canned-markets-and-orders
docker stop -t 120 pop-geth-deploy
rm -f geth/chain/geth.ipc

CONTRACT_SHA=$(cd packages/augur-tools/ && node scripts/get-contract-hashes.js)
DOCKER_BUILDKIT=1 docker build --no-cache -f packages/augur-tools/docker-builder/Dockerfile -t augurproject/"${BUILD_IMAGE}":${CONTRACT_SHA} .
