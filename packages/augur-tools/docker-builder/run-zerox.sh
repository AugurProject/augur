#!/bin/bash

echo "Running 0x mesh"

NETWORK_ID="123456"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
LOCAL_ADDRESSES="${DIR}/../../augur-artifacts/src/local-addresses.json"
PUBLIC_ADDRESSES="${DIR}/../../augur-artifacts/src/addresses.json"


if [[ -f "${LOCAL_ADDRESSES}" ]]; then
  ADDRESSES=`jq -s '.[0] * .[1]' ${PUBLIC_ADDRESSES} ${LOCAL_ADDRESSES}|jq -c .[\"${NETWORK_ID}\"]`
else
  ADDRESSES=`cat ${PUBLIC_ADDRESSES}|jq -c .[\"${NETWORK_ID}\"]`
fi

echo "local_addresses:"
echo "${ADDRESSES}"|jq

docker run \
  -it \
  --rm \
  -p 60557:60557 \
  -p 60558:60558 \
  -p 60559:60559 \
  -e ETHEREUM_NETWORK_ID="${NETWORK_ID}" \
  -e ETHEREUM_RPC_URL="http://localhost:8545" \
  -e USE_BOOTSTRAP_LIST="false" \
  -e BLOCK_POLLING_INTERVAL="1s" \
  -e CUSTOM_CONTRACT_ADDRESSES="${ADDRESSES}" \
  -e VERBOSITY=5 \
0xorg/mesh:latest
