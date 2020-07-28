#!/usr/bin/env sh

set -e;

printf "\nBuilding client....\n\n";

# This is an attempt to avoid memeory limitation in processes spawned from node.
cd packages/augur-ui;
./node_modules/.bin/webpack;

cd -;

yarn flash generate-wallet --keyfileOutputLocation /keys/priv.key
echo
yarn flash sdk-server --keyfile /keys/priv.key -p -w -a "${@:2}"
