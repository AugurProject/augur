#!/bin/bash

ipfs daemon &
sleep 10s
ipfs key gen --type=rsa --size=2048 augur-ui
export HASH_KEY=$(ipfs add -r build/ | tail -n 1 | awk '{print $2}')
echo "Using hash key of $HASH_KEY"
ipfs name publish --key=augur-ui $HASH_KEY
echo ipfs ls /ipfs/$HASH_KEY
