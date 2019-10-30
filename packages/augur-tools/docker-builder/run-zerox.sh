#!/bin/bash

echo "Running 0x mesh"

docker run \
  -it \
  --rm \
  -p 60557:60557 \
  -p 60558:60558 \
  -p 60559:60559 \
  -e ETHEREUM_NETWORK_ID="123456" \
  -e ETHEREUM_RPC_URL="http://localhost:8545" \
  -e USE_BOOTSTRAP_LIST="false" \
  -e BLOCK_POLLING_INTERVAL="1s" \
  -e VERBOSITY=5 \
0xorg/mesh:latest
