#!/bin/bash

docker kill geth-node &>/dev/null
docker rm geth-node &>/dev/null

npm run docker:geth:pop
npm run clean-start
