#!/bin/bash

if [[ "${DEPLOY:-true}" == "true" ]]; then
  node ./output/deployment/deployParaContractsNetwork.js $@
  if [[ "$?" != "0" ]]; then
    echo "Error while deploying para contracts to $ETHEREUM_NETWORK, exiting and skipping artifact management"
    exit 1
  fi
else
  echo "Skipping deploy, set DEPLOY=true to do it"
fi

