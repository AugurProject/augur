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
yarn flash run deploy --write-artifacts
yarn tools build
yarn flash run faucet --amount 10000000000000000000
yarn flash run rep-faucet --amount 100000
yarn flash run create-canned-markets
yarn flash run faucet -t 0x9d4c6d4b84cd046381923c9bc136d6ff1fe292d9 -a 1000000

# debug info
geth version | tee /augur/geth-version.txt
curl -s -H "Content-Type: application/json" --data '[{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1} ]' localhost:8545 | tee /augur/geth-blockNumber.txt

PID=$(pidof geth)
kill -INT $PID
sleep 10
tail /geth/geth.log
echo "geth: $PID has stopped"
