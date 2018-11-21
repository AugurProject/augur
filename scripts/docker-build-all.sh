yarn docker:build:augur
cd packages/augur-core
yarn docker:build
yarn artifacts
cd ../augur-tools
yarn docker:build