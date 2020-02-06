#!/bin/bash
set -euxo pipefail

cd /
./start.sh &

which node
node --version

echo "Resting for a bit"
sleep 10s

# XXX - defensive
cd /augur

###############################################################################
# PG: This section is idenntical to one-docker-to-rule-them-all.sh some time we
# should move it all into flash and fix the Addresses so that they can be
# reloaded.
# Until then -- Make sure changes work in BOTH scripts

if [ "$FAKE_TIME" == "true" ]; then
  yarn flash fake-all
else
  yarn flash normal-all
fi

# Still need to double-check builds after deploy
yarn build

# TODO when yarn build isn't needed, this can be folded into {fake,normal}-all
# Create-canned-markets will rep/cash faucet
yarn flash create-canned-markets

###############################################################################

# debug info
geth version | tee /augur/geth-version.txt
curl -s -H "Content-Type: application/json" --data '[{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1} ]' localhost:8545 | tee /augur/geth-blockNumber.txt

PID=$(pidof geth)
kill -INT $PID
sleep 10
tail /geth/geth.log
echo "geth: $PID has stopped"
