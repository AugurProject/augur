#!/bin/bash

set -ex
trap "exit" INT

networkid="${1}"
symlink="$HOME/.ethereum"
maxpeers="64"
cache="2048"
syncmode="fast"

if [ -L $symlink ]; then
  rm $symlink
fi
if [ "${networkid}" = "4" ]; then
  symlinked="$HOME/.rinkeby"
else
  symlinked="$HOME/.ethereum-${networkid}"
fi
ln -s $symlinked $symlink

if [ "${networkid}" = "1" ]; then
  address="0x63524e3fe4791aefce1e932bbfb3fdf375bfad89"
  geth --syncmode=$syncmode --cache=$cache --maxpeers=$maxpeers --etherbase=$address console
  # geth --nodiscover --syncmode=$syncmode --cache=$cache --maxpeers=$maxpeers --etherbase=$address console
else
  if [ "${networkid}" = "3" ]; then
    extraflags="--testnet"
    address="0x7c0d52faab596c08f484e3478aebc6205f3f5d8c"
  elif [ "${networkid}" = "4" ]; then
    bootnodes="enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303"
    extraflags="--rinkeby --bootnodes=${bootnodes} --datadir=${symlinked}"
    address="0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a"
  else
    extraflags=""
    address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
  fi
  geth --syncmode=$syncmode $extraflags --cache=$cache --networkid=$networkid --wsorigins="*" --ws --wsapi="eth,net,web3" --rpc --rpcapi="eth,net,web3" --rpccorsdomain="*" --maxpeers=$maxpeers --etherbase=$address console
fi
