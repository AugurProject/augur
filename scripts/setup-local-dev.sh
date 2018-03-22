#!/usr/bin/env bash
trap "kill 0" EXIT

set -e;

export USE_NORMAL_TIME="false";
export ETHEREUM_HOST="127.0.0.1";
export ETHEREUM_GAS_PRICE_IN_NANOETH="1";
export ETHEREUM_HTTP=http://127.0.0.1:8545;
export ETHEREUM_WS=http://127.0.0.1:8546;

export ETHEREUM_PRIVATE_KEY="fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a";

CONTAINER_NAME="geth-node";
DOCKER_IMAGE="augurproject/dev-pop-geth:core-$(npm view augur-core version)";

if [ "$(docker ps -a | grep $CONTAINER_NAME)" ]; then
  echo "Kill running container...";
  docker kill $CONTAINER_NAME;
fi

echo "$CONTAINER_NAME: $DOCKER_IMAGE";
docker pull $DOCKER_IMAGE;
docker run -it -d --rm --name $CONTAINER_NAME -p 8545:8545 -p 8546:8546 $DOCKER_IMAGE;

cd ../;

echo "Building augur.js";
pushd augur.js;
rm -rf node_modules;
yarn;
yarn run build;
yarn link;

docker cp $CONTAINER_NAME:/augur.js/src/contracts/addresses.json src/contracts/addresses.json;

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
