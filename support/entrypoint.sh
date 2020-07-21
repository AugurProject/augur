#!/usr/bin/env sh

yarn ui build;
yarn flash sdk-server -w -a "${@:2}"
