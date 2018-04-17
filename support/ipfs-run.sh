#!/bin/bash

if [ "$RUN_LOCAL_ONLY" != "true" ]; then
  ipfs daemon &
  sleep 10s

  # publish files with key if available
  /augur/ipfs-configure.sh
  service cron start
  if [ "$PUBLISH_ONLY" = "true" ]; then
    exit
  fi

  echo "Finished IPFS configuration"
fi

cd /etc/nginx/
# configure nginx to be proxy for ipfs
if [ ! -f cache ]; then
  mkdir cache
fi
rm -rf ./cache/* && mkdir ./cache/temp && chown www-data ./cache/temp
echo "Now listening ..."
nginx
