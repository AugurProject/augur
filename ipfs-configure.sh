#!/bin/bash

ipfs daemon &
sleep 10s
export NEW_BUILD_HASH=$(ipfs add -r build/ | tail -n 1 | awk '{print $2}')
echo "Using hash key of $NEW_BUILD_HASH"
export IPFS_KEY=$(ipfs key list | tail -1)
echo "Using ipfs key: $IPFS_KEY"
ipfs name publish --key=$IPFS_KEY $NEW_BUILD_HASH
mkdir /augur/ipfs-deploy
echo $NEW_BUILD_HASH > /augur/ipfs-deploy/NEW_BUILD_HASH
