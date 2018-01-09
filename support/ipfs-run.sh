#!/bin/bash

ipfs daemon &
sleep 10s

# configure nginx to be proxy for ipfs
echo /augur/ipfs-deploy/NEW_BUILD_HASH
cd /etc/nginx && rm -rf ./cache/* && mkdir ./cache && mkdir ./cache/temp && chown www-data ./cache/temp
service cron start
nginx
