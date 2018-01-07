#!/bin/bash

ipfs daemon &
export HASH_KEY=$(ipfs add -r build/ | tail -n 1 | awk '{print $2}')
echo "Using hash key of $HASH_KEY"
ipfs name publish --key=self $HASH_KEY
