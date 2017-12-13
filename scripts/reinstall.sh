#!/bin/bash
# Full reinstall, including node_modules wipe.

set -e
trap "exit" INT

PWD=$(pwd)

cd "$(dirname $(readlink -f "$0"))/.."

rm -Rf node_modules/

if [ "$1" == "-l" ]; then
  npm run link # so npm install doesn't throw if versions incremented locally
fi
npm install
if [ "$1" == "-l" ]; then
  npm run link
fi

npm run lint
npm test

npm run dev

cd "$PWD"
