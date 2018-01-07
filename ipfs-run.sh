#!/bin/bash

ipfs daemon &
sleep 10s
# configure nginx to be proxy for ipfs
export HASH_KEY=$(ipfs config show | grep ID | cut -c 16-61)
echo ipfs ls /ipfs/$HASH_KEY
