#!/bin/bash

# Looks like yarn 1.22.x breaks --silent
if [[ "$(yarn --version)" =~ ^1.22 ]]; then
  export ETHEREUM_CHAIN_ID=`yarn --silent flash network-id | sed '1d'`
  export CUSTOM_CONTRACT_ADDRESSES=`yarn --silent flash get-all-contract-addresses --ugly | sed '1d'`
  export GNOSIS_SAFE_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address --name GnosisSafe | sed '1d'`
  export PROXY_FACTORY_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address --name ProxyFactory | sed '1d'`
  export ZEROX_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address --name ZeroXTrade -r -l | sed '1d'`
else
  export ETHEREUM_CHAIN_ID=`yarn --silent flash network-id`
  export CUSTOM_CONTRACT_ADDRESSES=`yarn --silent flash get-all-contract-addresses --ugly`
  export GNOSIS_SAFE_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address --name GnosisSafe`
  export PROXY_FACTORY_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address --name ProxyFactory`
  export ZEROX_CONTRACT_ADDRESS=`yarn --silent flash get-contract-address --name ZeroXTrade -r -l`
fi

