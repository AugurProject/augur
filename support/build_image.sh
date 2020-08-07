#!/usr/bin/env sh

set -e;

VERSION=$(node -e 'process.stdout.write(require("./lerna.json").version);');
printf "Building docker runner for version %s\n" "$VERSION";

yarn;

# Pre-build this to avoid the
yarn workspace orbit-web build;

docker build . \
  -f support/Dockerfile \
  --build-arg CURRENT_COMMITHASH="$(git rev-parse HEAD)" \
  --build-arg CURRENT_VERSION=$VERSION \
  -t augurproject/augur:runner \
  -t "augurproject/augur:v$VERSION";
