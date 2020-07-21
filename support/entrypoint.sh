#!/usr/bin/env sh

yarn ui build;
yarn flash sdk-server -p -w -a "${@:2}"
