#!/usr/bin/env bash
trap "kill 0" EXIT

set -e;

export USE_NORMAL_TIME="false";
export ETHEREUM_HOST="127.0.0.1";
export ETHEREUM_GAS_PRICE_IN_NANOETH="1";
export ETHEREUM_HTTP=http://127.0.0.1:8545;
export ETHEREUM_WS=http://127.0.0.1:8546;

export ETHEREUM_PRIVATE_KEY="fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a";

SHOULD_SETUP_MARKETS=false;

set +e;
GETH_STATE=$(docker inspect -f {{.State.Running}} geth-node);
if [[ "$GETH_STATE" != "true" ]]; then
  echo "geth-node: ";
  docker run -it -d --rm --name geth-node -p 8545:8545 -p 8546:8546 augurproject/dev-node-geth:latest;
  SHOULD_SETUP_MARKETS=true;
else
  echo "geth-node: already running";
fi
set -e;

cd ../;

echo "Building augur.js";
pushd augur.js;
rm -rf node_modules;
yarn;
yarn run build;
yarn link;
$SHOULD_SETUP_MARKETS && yarn run deploy:environment;

popd;

echo "Start augur-node";
pushd augur-node;
rm -rf node_modules;
yarn install;
yarn link augur.js;
yarn run clean-start &

popd;

echo "Start augur (UI)";
pushd augur;
rm -rf node_modules;
yarn;
yarn link augur.js;
yarn run dev &

wait
