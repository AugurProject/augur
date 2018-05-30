#!/bin/bash

mkdir -p cache
mkdir -p /run/nginx

rm -rf ./cache/* && mkdir ./cache/temp && chown nginx ./cache/temp /run/nginx
echo "Now listening ..."
nginx
