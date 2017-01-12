#!/bin/bash
# geth startup script

set -ex
trap "exit" INT

if [ `hostname` = "heavy" ]; then
  address="0xab50dcce6c36a033dc4a3b451d23868c909afbd6"
else
  address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
  # address="0x639b41c4d3d399894f2a57894278e1653e7cd24c"
# address="0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9"
fi
maxpeers="128"
network="${1}"
symlink="$HOME/.ethereum"
passfile="${symlink}/.password"
bootnodes=""
optargs=""

if [ "${network}" = "3" ]; then
  optargs="--testnet"
  # address="0x15f6400a88fb320822b689607d425272bea2175f"
  address="0x7c0d52faab596c08f484e3478aebc6205f3f5d8c"
elif [ "${network}" = "1" ]; then
  address="0x63524e3fe4791aefce1e932bbfb3fdf375bfad89"
elif [ "${network}" = "10101" ]; then
  # address="0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a"
  # address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
  optargs="--nodiscover"
elif [ "${network}" = "9000" ]; then
  optargs="--mine --minerthreads 1"
elif [ "${network}" = "7" ]; then
  optargs="--mine --minerthreads 1"
fi

if [ -L $symlink ]; then
  rm $symlink
fi
ln -s "$HOME/.ethereum-${network}" $symlink

geth $optargs --shh --ws --wsapi "eth,net,web3,admin,personal,miner,txpool,shh" --wsport 8546 --wsorigins "*" --cache 2048 --networkid $network --rpc --rpcapi "eth,net,web3,admin,personal,miner,txpool,shh" --ipcapi "admin,eth,debug,miner,net,txpool,personal,web3,shh" --rpccorsdomain "*" --maxpeers $maxpeers --etherbase $address --unlock $address --password $passfile console
