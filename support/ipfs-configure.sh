#!/bin/bash

if [ ! -z "$IPFS_KEY" ]; then
  echo "key found updating keystore"
  echo $IPFS_KEY | base64 -d > ~/.ipfs/keystore/augur
fi

export NEW_BUILD_HASH=$(ipfs add -r build/ | tail -n 1 | awk '{print $2}')
echo "Using build dir hash $NEW_BUILD_HASH"
if [ ! -z "$IPFS_KEY" ]; then
  echo "publishing with key to update ipns"
  echo $(ipfs name publish --key=augur $NEW_BUILD_HASH)
  # remove key after initial publishing
  rm ~/.ipfs/keystore/augur
else
  echo "publishing/pinning build directory"
  echo $(ipfs name publish $NEW_BUILD_HASH)
fi

mkdir /augur/ipfs-deploy
echo $NEW_BUILD_HASH > /augur/ipfs-deploy/NEW_BUILD_HASH
