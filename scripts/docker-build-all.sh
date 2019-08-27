set -euxo pipefail
# build main augur image so we can use to build all the others
yarn clean
yarn
yarn build
echo "docker:build:augur - build base augur image"
yarn docker:build:augur

# build augur core
echo "yarn workspace @augurproject/core docker:build - building augur-core image"
yarn workspace @augurproject/core docker:build

# augur-tools
echo "building @augurproject/tools image"
yarn workspace @augurproject/tools docker:build
