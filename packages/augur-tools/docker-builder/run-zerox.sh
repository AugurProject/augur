#!/bin/bash

NETWORK_ID="$1"
if [[ -z "${NETWORK_ID}" ]]; then
  echo 'Requires network/chain id. Ex: "1" is mainnet.'
  exit 1
fi

ETH_NODE="$2"
if [[ -z "${ETH_NODE}" ]]; then
  echo 'Requires ethnode url. Ex: "http://localhost:8545" is local.'
  exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
LOCAL_ADDRESSES="${DIR}/../../augur-artifacts/src/local-addresses.json"
PUBLIC_ADDRESSES="${DIR}/../../augur-artifacts/src/addresses.json"

if [[ -f "${LOCAL_ADDRESSES}" ]]; then
  ADDRESSES=`jq -s '.[0] * .[1]' ${PUBLIC_ADDRESSES} ${LOCAL_ADDRESSES}|jq -c .[\"${NETWORK_ID}\"]`
else
  ADDRESSES=`cat ${PUBLIC_ADDRESSES}|jq -c .[\"${NETWORK_ID}\"]`
fi

echo "Addresses:"
echo "${ADDRESSES}"|jq

echo "Running 0x mesh"
docker run \
  -it \
  --rm \
  -p 60557:60557 \
  -p 60558:60558 \
  -p 60559:60559 \
  -e ETHEREUM_NETWORK_ID="${NETWORK_ID}" \
  --net="host" \
  -e ETHEREUM_RPC_URL="${ETH_NODE}" \
  -e USE_BOOTSTRAP_LIST="false" \
  -e BLOCK_POLLING_INTERVAL="1s" \
  -e CUSTOM_CONTRACT_ADDRESSES="${ADDRESSES}" \
  -e VERBOSITY=5 \
0xorg/mesh:latest

# The network id is a required parameter but doesn't seem to do anything...
# choosing the wrong id doesn't seem to matter to the mesh. However it does
# matter to our address extraction so a fake value isn't appropriate either.

# We set --net="host" so that 0x mesh docker can talk to the host, where
# the ethnode is being run. It might be elsewhere in non-dev deployments.
# This is also making the -p options unnecessary.
