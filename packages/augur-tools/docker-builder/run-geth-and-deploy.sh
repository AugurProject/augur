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

# couldn't get dp deploy to work had to split it up, contract addresses were reloaded
yarn workspace @augurproject/tools flash run deploy
yarn workspace @augurproject/tools build
yarn workspace @augurproject/tools flash run rep-faucet --amount 100000
yarn workspace @augurproject/tools flash run create-canned-markets-and-orders

# debug info
geth version | tee /augur/geth-version.txt
curl -s -H "Content-Type: application/json" --data '[{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1} ]' localhost:8545 | tee /augur/geth-blockNumber.txt

$(kill -TERM $(pidof geth))
wait
