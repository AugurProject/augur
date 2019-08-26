#!/bin/bash

declare -i NODE_PID

read -r -d INITIAL_TX_DATA << --EOF
{
  "jsonrpc":"2.0",
  "method":"eth_sendTransaction",
  "params": [{
    "value": "0x0",
    "to":"0x0000000000000000000000000000000000000000",
    "from":"${UNLOCK_ACCOUNT}",
    "data":"0x",
    "gasPrice":"0x1"
  }],
  "id": 1
}
--EOF


node_cleanup() {
  kill $NODE_PID > /dev/null 2>&1
}

node_wait() {
  wait $NODE_PID
}

trap node_cleanup INT TERM

eth_call() {
  local response
  response=$(curl --silent --show-error localhost:$RPCPORT -H "Content-Type: application/json" -X POST --data "${response}" 2>&1)
  if [[ \
    "${response}" == *'"error":'* || \
    "${response}" == *'Connection refused'* || \
    "${response}" == *'bad method'* \
  ]] ; then
    echo "not ready"
  else
    echo "ready"
  fi
}

eth_running() {
  kill -0 $NODE_PID > /dev/null 2>&1
}

node_detect_ready() {
  while eth_running && [[ $(eth_call $INITIAL_TX_DATA) == "not ready" ]] ; do sleep 1; done
}

start() {
  setup_chain_dir
  node_start

  node_detect_ready &
  wait $!

  if ! eth_running ; then
    >&2 echo "Failed to start Ethereum Node, exiting"
    RESULT=1
  else
    echo -e "\e[32mEthereum Node up and running!\e[0m"
    node_wait
    RESULT=0
  fi

  node_cleanup
  exit $RESULT
}

