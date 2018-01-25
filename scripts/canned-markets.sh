#!/bin/bash

network="$1"
scriptsPath="$(dirname $(readlink -f "$0"))"
keystorePath="$scriptsPath/dev-key.json"

if [ ! -n "$ETHEREUM_PRIVATE_KEY" ]; then
  if [ ! -n "$ETHEREUM_PASSWORD" ]; then
    export ETHEREUM_PASSWORD=""
  fi
  if [ ! -f "$keystorePath" ]; then
    wget -q -O $keystorePath https://raw.githubusercontent.com/AugurProject/ethereum-nodes/master/parity-poa/dev-key.json
  fi
fi

if [ "$network" == "aura" ]; then
  export AUGUR_WS="wss://aura.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://aura.ethereum.nodes.augur.net"
  # export AUGUR_WS="ws://aura.augur.origin.augur.net:9001"
  # export ETHEREUM_HTTP="http://aura.ethereum.origin.augur.net:8545"
elif [ "$network" == "clique" ]; then
  export AUGUR_WS="wss://clique.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://clique.ethereum.nodes.augur.net"
  # export AUGUR_WS="ws://clique.augur.origin.augur.net:9001"
  # export ETHEREUM_HTTP="http://clique.ethereum.origin.augur.net:8545"
elif [ "$network" == "rinkeby" ]; then
  export AUGUR_WS="wss://rinkeby.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://rinkeby.ethereum.nodes.augur.net"
  export ETHEREUM_WS="wss://websocket-rinkeby.ethereum.nodes.augur.net"
  # export AUGUR_WS="ws://rinkeby.augur.origin.augur.net:9001"
  # export ETHEREUM_HTTP="http://rinkeby.ethereum.origin.augur.net:8545"
fi

if [ "$2" == "orders" ]; then
  node $scriptsPath/canned-markets/create-orders.js $keystorePath || exit 1
else
  node $scriptsPath/rep-faucet.js $keystorePath || exit 1
  node $scriptsPath/canned-markets/create-markets.js $keystorePath || exit 1
fi

rm -f $keystorePath

exit 0
