#!/bin/bash
# geth startup script

set -ex
trap "exit" INT

# address="0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a"
address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
# address="0x639b41c4d3d399894f2a57894278e1653e7cd24c"
# address="0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9"
# address="0x15f6400a88fb320822b689607d425272bea2175f"
maxpeers="128"
network="${1}"
symlink="$HOME/.ethereum"

if [ -L $symlink ]; then
  rm $symlink
fi
ln -s "$HOME/.ethereum-${network}" $symlink

if [ "${network}" = "1" ]; then
  # address="0x7e614ec62cfd5761f20a9c5a2fe2bc0ac7431918"
  address="0x63524e3fe4791aefce1e932bbfb3fdf375bfad89"
  # geth --fast --cache=2048 --rpc --rpcapi="eth,net,web3" --maxpeers=$maxpeers --etherbase=$address console
  geth --syncmode="fast" --cache=2048 --maxpeers=$maxpeers --etherbase=$address console
else
  if [ "${network}" = "3" ]; then
    optargs="--testnet"
    # address="0x7c0d52faab596c08f484e3478aebc6205f3f5d8c"
  else
    optargs=""
  fi
  geth --syncmode="fast" $optargs --cache=2048 --networkid=$network --wsorigins="*" --ws --wsapi="eth,net,web3" --wsport=8546 --rpc --rpcapi="eth,net,web3" --rpccorsdomain="*" --maxpeers=$maxpeers --etherbase=$address --unlock=$address console
fi
