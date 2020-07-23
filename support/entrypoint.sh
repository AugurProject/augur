#!/usr/bin/env sh

yarn ui build;

yarn flash generate-wallet --keyfileOutputLocation /keys/priv.key
yarn flash sdk-server --keyfile /keys/priv.key -p -w -a "${@:2}"
