#!/bin/bash

network="$1"
scriptsPath="$(dirname $(readlink -f "$0"))"
keystorePath="$scriptsPath/dev-key.json"

echo "ethereum private key: $ETHEREUM_PRIVATE_KEY"

if [ ! -n "$ETHEREUM_PRIVATE_KEY" ]; then
  if [ ! -n "$ETHEREUM_PASSWORD" ]; then
    export ETHEREUM_PASSWORD=""
  fi
  wget -q -O $keystorePath https://raw.githubusercontent.com/AugurProject/ethereum-nodes/master/parity-poa/dev-key.json
fi

if [ "$network" == "aura" ]; then
  export AUGUR_WS="wss://aura.augur.nodes.augur.net"
  # export ETHEREUM_HTTP="https://aura.ethereum.nodes.augur.net"
  export ETHEREUM_HTTP="http://aura.ethereum.origin.augur.net:8545"
elif [ "$network" == "clique" ]; then
  export AUGUR_WS="wss://clique.augur.nodes.augur.net"
  # export ETHEREUM_HTTP="https://clique.ethereum.nodes.augur.net"
  export ETHEREUM_HTTP="http://clique.ethereum.origin.augur.net:8545"
elif [ "$network" == "instantseal" ]; then
  export AUGUR_WS="wss://instantseal.augur.nodes.augur.net"
  # export ETHEREUM_HTTP="https://instantseal.ethereum.nodes.augur.net"
  export ETHEREUM_HTTP="http://instantseal.ethereum.origin.augur.net:8545"
elif [ "$network" == "rinkeby" ]; then
  export AUGUR_WS="wss://rinkeby.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://rinkeby.ethereum.nodes.augur.net"
  export ETHEREUM_WS="wss://websocket-rinkeby.ethereum.nodes.augur.net"
fi

if [ "$2" == "orders" ]; then
  node $scriptsPath/canned-markets/create-orders.js $keystorePath
else
  node $scriptsPath/rep-faucet.js $keystorePath
  node $scriptsPath/canned-markets/create-markets.js $keystorePath
fi

rm -f $keystorePath
