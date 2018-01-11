#!/bin/bash

ipfs daemon &
sleep 5s

# publish files with key if available
/augur/ipfs-configure.sh
cd /etc/nginx/
# configure nginx to be proxy for ipfs
if [ ! -f cache ]; then
  mkdir cache
fi
rm -rf ./cache/* && mkdir ./cache/temp && chown www-data ./cache/temp
service cron start
nginx
