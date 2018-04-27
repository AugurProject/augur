#!/bin/bash

TAG=core-$(node scripts/core-version.js)
docker push augurproject/augur-node:$TAG
