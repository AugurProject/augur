#!/bin/bash

if ! [ -x "$(command -v docker-machine)" ]; then 
  echo "docker-machine must be installed to run this script: https://docs.docker.com/machine/install-machine/"
  exit 1
fi

[ -z "$DIGITALOCEAN_ACCESS_TOKEN" ] && echo "Set DIGITALOCEAN_ACCESS_TOKEN to an access token with write permissions. Create this from the API section in the Digital Ocean Dashboard" && exit 1;
[ -z "${ETHEREUM_HTTP}${ETHEREUM_WS}" ] && echo "Must set at least one of ETHEREUM_WS and ETHEREUM_HTTP to an ethereum node for augur-node to index" && exit 1;

status=$(docker-machine status augur-node)
case $status in
  Running)
    echo "augur-node already started via docker machine"
    ;;
  Stopped)
    echo "augur-node machine exists, but Stopped; starting"
    docker-machine start augur-node
    ;;
  *)
    echo "Preparing Digital Ocean Droplet:"
    docker-machine inspect augur-node > /dev/null 2>&1 || docker-machine create --driver digitalocean augur-node
    ;;
esac

# create droplet augur-node
eval "$(docker-machine env augur-node)"

if [[ $(docker ps | grep augur-node) ]]; then
  echo "augur-node container already running on host, to kill user docker kill augur-node"
  echo "http://$(docker-machine ip augur-node):9001 is up"
  exit 0
else
  # To make sure the container is deleted
  docker kill /augur-node 2>&1 > /dev/null
fi

# run docker in droplet

echo "Starting Augur Node on $(docker-machine ip augur-node) using docker"
docker run -d --rm -p 9001:9001 -p 9002:9002 -e ETHEREUM_WS=$ETHEREUM_WS -e ETHEREUM_HTTP=$ETHEREUM_HTTP --name augur-node augurproject/augur-node:core-1.1.0 > /dev/null

if [[ $(docker ps | grep augur-node) ]]; then
  echo "Augur Node Docker Container did not start!"
  exit 1
else
  echo "http://$(docker-machine ip augur-node):9001 is up"
fi
