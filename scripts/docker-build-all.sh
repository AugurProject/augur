set -euxo pipefail
# build main augur image so we can use to build all the others
echo "docker:build:augur - build base augur image"
docker pull augurproject/augur-build:latest
yarn docker:build:augur

# build augur core
echo "yarn workspace @augurproject/core docker:build - building augur-core image"
yarn workspace @augurproject/core docker:build

# augur-core artifacts
echo " yarn workspace @augurproject/core artifacts - building artifacts"
yarn workspace @augurproject/core artifacts

# augur-tools
echo "building @augurproject/tools image"
yarn workspace @augurproject/tools docker:build
