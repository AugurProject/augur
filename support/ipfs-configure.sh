#!/bin/bash

ipfs daemon &
sleep 10s
export NEW_BUILD_HASH=$(ipfs add -r build/ | tail -n 1 | awk '{print $2}')
echo "Using hash key of $NEW_BUILD_HASH"
export PUBLISHED_HASH=$(ipfs name publish $NEW_BUILD_HASH)
mkdir /augur/ipfs-deploy
echo $NEW_BUILD_HASH > /augur/ipfs-deploy/NEW_BUILD_HASH
echo $PUBLISHED_HASH > /augur/ipfs-deploy/PUBLISHED_BUILD_HASH
