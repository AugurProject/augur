#!/bin/bash
# Full reinstall, including node_modules wipe.

set -e
trap "exit" INT

PWD=$(pwd)

cd "$(dirname $(readlink -f "$0"))/.."

rm -rf node_modules/

npm install

npm run lint
npm test

npm run dev

cd "$PWD"
