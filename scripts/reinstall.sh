#!/bin/bash
# Full reinstall, including node_modules wipe.

set -e
trap "exit" INT

PWD=$(pwd)

cd "$(dirname $(readlink -f "$0"))/.."

rm -rf node_modules/

if [ "$1" == "-l" ]; then
  export ENDPOINT_HTTP=http://127.0.0.1:8545
  export ENDPOINT_WS=ws://127.0.0.1:8546
fi
npm install
if [ "$1" == "-l" ]; then
  yarn link augur.js
fi

npm run clean
npm run build

npm run lint
npm test

npm run migrate
npm start

cd "$PWD"
