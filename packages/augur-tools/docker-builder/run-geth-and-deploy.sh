#!/bin/bash

cd /
./start.sh &

echo "Resting for a bit"
sleep 10s

node /augur/packages/augur-tools/scripts/dp deploy

$(kill -TERM $(pidof geth))
