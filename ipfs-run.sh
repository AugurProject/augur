#!/bin/bash

ipfs daemon &
sleep 10s
# configure nginx to be proxy for ipfs
echo ipfs ls /ipfs/$HASH_KEY
