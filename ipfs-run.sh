#!/bin/bash

ipfs daemon &
sleep 10s

# configure nginx to be proxy for ipfs
cd /etc/nginx && rm -rf ./cache/* && mkdir ./cache && mkdir ./cache/temp && chown www-data ./cache/temp
service nginx restart
service cron start
