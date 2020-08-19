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

if [ "$NORMAL_TIME" == "true" ]; then
  yarn flash normal-all --createMarkets
else
  yarn flash fake-all --createMarkets
fi

paraCash=$(node -e 'process.stdout.write(require("./packages/augur-artifacts/build/environments/local.json").addresses.WETH9);')
echo yarn flash deploy-para-augur -c "$paraCash"
yarn flash deploy-para-augur -c "$paraCash"

# Still need to double-check builds after deploy
# yarn build

###############################################################################

# debug info
geth version | tee /augur/geth-version.txt
curl -s -H "Content-Type: application/json" --data '[{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1} ]' localhost:8545 | tee /augur/geth-blockNumber.txt

PID=$(pidof geth)
kill -INT "$PID"
sleep 10
tail /geth/geth.log
echo "geth: $PID has stopped"
