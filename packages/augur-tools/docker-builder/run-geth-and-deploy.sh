#!/bin/bash

cd /
./start.sh &

echo "Resting for a bit"
sleep 10s

# couldn't get dp deploy to work had to split it up, contract addresses were reloaded
node /augur/packages/augur-tools/scripts/dp upload
node /augur/packages/augur-tools/scripts/dp create-markets

$(kill -TERM $(pidof geth))
