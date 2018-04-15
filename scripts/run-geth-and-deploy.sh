#!/bin/bash

cd /
./start.sh &

cd /augur.js

echo "Resting for a bit"
sleep 10s

node scripts/dp deploy

$(kill -TERM $(pidof geth))
