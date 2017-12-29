#!/bin/bash

HERE="$(dirname $(readlink -f "$0"))"
network="$1"
ethereumNodesPath="$HERE/ethereum-nodes"

if [ ! -d "$ethereumNodesPath" ]; then
  git clone https://github.com/AugurProject/ethereum-nodes $ethereumNodesPath
fi

if [ "$network" == "aura" ]; then
  export AUGUR_WS="wss://aura.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://aura.ethereum.nodes.augur.net"
  export ETHEREUM_PASSWORD=""
  keystorePath="$ethereumNodesPath/parity-poa/dev-key.json"
elif [ "$network" == "clique" ]; then
  export AUGUR_WS="wss://clique.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://clique.ethereum.nodes.augur.net"
  export ETHEREUM_PASSWORD=""
  keystorePath="$ethereumNodesPath/geth-poa/dev-key.json"
elif [ "$network" == "instantseal" ]; then
  export AUGUR_WS="wss://instantseal.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://instantseal.ethereum.nodes.augur.net"
  export ETHEREUM_PASSWORD=""
  keystorePath="$ethereumNodesPath/parity-instantseal/dev-key.json"
elif [ "$network" == "rinkeby" ]; then
  export AUGUR_WS="wss://rinkeby.augur.nodes.augur.net"
  export ETHEREUM_HTTP="https://rinkeby.ethereum.nodes.augur.net"
  export ETHEREUM_WS="wss://websocket-rinkeby.ethereum.nodes.augur.net"
  export ETHEREUM_PASSWORD="$(cat $HERE/../../keys/rinkeby/signer/fc18cbc391de84dbd87db83b20935d3e89f5dd91.txt)"
  keystorePath="$HERE/../../keys/rinkeby/signer/fc18cbc391de84dbd87db83b20935d3e89f5dd91"
fi

if [ "$2" == "orders" ]; then
  node $HERE/canned-markets/create-orders.js $keystorePath
else
  node $HERE/rep-faucet.js $keystorePath
  node $HERE/canned-markets/create-markets.js $keystorePath
fi

rm -rf $ethereumNodesPath
