#!/bin/bash

ipfs daemon &
sleep 10s
export NEW_BUILD_HASH=$(ipfs add -r build/ | tail -n 1 | awk '{print $2}')
echo "Using hash key of $NEW_BUILD_HASH"
ipfs name publish $NEW_BUILD_HASH
mkdir /augur/ipfs-deploy
echo $NEW_BUILD_HASH > /augur/ipfs-deploy/NEW_BUILD_HASH
sed -i 's/NEW_BUILD_HASH/'"$NEW_BUILD_HASH"'/g' /etc/nginx/sites-available/default
