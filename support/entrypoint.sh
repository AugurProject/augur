#!/usr/bin/env sh

set -e;

printf "\nBuilding client....\n\n";

# This is an attempt to avoid memeory limitation in processes spawned from node.
cd packages/augur-ui;

export ENABLE_MAINNET=true

#REPORTING_ONLY=true ./node_modules/.bin/webpack;
#mv build reporting-only-build;
mkdir reporting-only-build

PARA_AUGUR_DEPLOY_TOKEN_NAME=WETH ./node_modules/.bin/webpack;
#mv build para-augur-weth;

#./node_modules/.bin/webpack;

cd -;

yarn flash generate-wallet --keyfileOutputLocation /keys/priv.key
echo
ETHEREUM_HTTP=${ETH_NODE_URL} yarn flash sdk-server --keyfile /keys/priv.key -p -r -w -a "${@:2}"
