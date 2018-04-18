#!/bin/bash

cd /etc/nginx/

if [ ! -f cache ]; then
  mkdir cache
fi
rm -rf ./cache/* && mkdir ./cache/temp && chown www-data ./cache/temp
echo "Now listening ..."
nginx
