#!/usr/bin/env sh

set -e;

printf "\nBuilding client....\n\n";

# This is an attempt to avoid memeory limitation in processes spawned from node.
cd packages/augur-ui;

ENABLE_MAINNET=true REPORTING_ONLY=true ./node_modules/.bin/webpack;
mv build reporting-only-build;

ENABLE_MAINNET=true ./node_modules/.bin/webpack;

cd -;

yarn flash generate-wallet --keyfileOutputLocation /keys/priv.key
echo
ETHEREUM_HTTP=${ETH_NODE_URL} yarn flash sdk-server --keyfile /keys/priv.key -p -r -w -a "${@:2}"
