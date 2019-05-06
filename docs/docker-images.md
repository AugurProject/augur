# Docker Images

Docker images are created to extract artifacts and build populated ethereum nodes used for development.

## yarn docker:build:all

Builds all the below docker images

## yarn docker:build:core

(run in core, having issues running yarn docker:build:core from root) core docker image compiles the contracts and outputs abi.json and contracts.json. These files are used to deploy contracts on ethereum nodes. Look in artifacts to see these files. These files are needed in for the ethereum populated docker images.

## yarn docker:build:augur

(run in root) The monorepo has a dockerfile that will create a docker images with linked repos. augurproject/build:latest can be imported into dockerfiles and needed files copied. This is needed for the ethereum populated docker images.

## yarn docker:build

(run in tools, having issues running yarn docker:build:pops from root) These development docker images have all contracts uploaded and canned markets created. They use the above docker images. Look in tools package.json to see how to run individual docker images.

## push docker images

To push newly created dockers goto tools and use `yarn docker:push` after docker login to push images to hub.docker.com

## how to run populated docker images

Currently need to change to packages/tools directory. Here are the commands:

- yarn docker:geth:pop -- to run `must push time` 1 second blocks populated docker image
- yarn docker:geth:pop-15 -- to run `mush push time` 15 second blocks populated docker image
- yarn docker:geth:pop-normal-time -- to run normal time populated docker image
