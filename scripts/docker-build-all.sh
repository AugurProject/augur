set -euxo pipefail
# build main augur image so we can use to build all the others
echo "docker:build:augur - build base augur image"
yarn docker:build:augur

# build augur core
echo "yarn workspace augur-core docker:build - building augur-core image"
yarn workspace augur-core docker:build

# augur-core artifacts
echo " yarn workspace augur-core artifacts - building artifacts"
yarn workspace augur-core artifacts

# augur-tools
echo "building augur-tools image"
yarn workspace augur-tools docker:build
