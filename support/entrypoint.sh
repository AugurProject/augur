#!/usr/bin/env sh

set -e;

printf "\nBuilding client....\n\n";

# This is an attempt to avoid memeory limitation in processes spawned from node.
cd packages/augur-ui;

REPORTING_ONLY=true ./node_modules/.bin/webpack;
mv build reporting-only-build

./node_modules/.bin/webpack; # builds into "build" dir

cd -;

yarn flash generate-wallet --keyfileOutputLocation /keys/priv.key
echo
yarn flash sdk-server --keyfile /keys/priv.key -p -w -a "${@:2}"
