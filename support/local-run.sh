#!/bin/bash

mkdir -p cache

rm -rf ./cache/* && mkdir ./cache/temp && chown www-data ./cache/temp
echo "Now listening ..."
nginx
