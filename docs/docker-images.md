# Docker Images

Docker images are created to extract artifacts and build populated ethereum nodes used for development.

## yarn docker:build:augur-core

augur-core docker image compiles the contracts and outputs abi.json and contracts.json. These files are used to deploy contracts on ethereum nodes. Look in augur-artifacts to see these files. These files are needed in for the ethereum populated docker images.

## yarn docker:build:augur

The monorepo has a dockerfile that will create a docker images with linked repos. augurProject/augur:latest can be imported into dockerfiles and needed files copied. This is needed for the ethereum populated docker images.

## yarn docker:build:pops

These development docker images have all contracts uploaded and canned markets created. They use the above docker images. Look in augur-tools package.json to see how to run individual docker images.
