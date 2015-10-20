#!/bin/bash
# geth startup script

set -e
trap "exit" INT

symlink="$HOME/.ethereum-of-the-moment"
datadir="$HOME/.ethereum-augur"
network="7"
address="0x639b41c4d3d399894f2a57894278e1653e7cd24c"
maxpeers="64"
passfile="${symlink}/.password"
optargs=""

if [ "${1}" = "-t" ]; then
    datadir="$HOME/.augur-test"
    optargs="--mine --nodiscover"
    network="10101"
    address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
fi

if [ -L $symlink ]; then
    rm $symlink
fi
ln -s $datadir $symlink

geth $optargs --networkid $network --datadir $symlink --rpc --shh --rpcapi "shh,db,eth,net,web3" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpccorsdomain "http://eth1.augur.net http://eth2.augur.net http://eth3.augur.net http://eth4.augur.net http://eth5.augur.net http://augur.divshot.io http://augur-stage.herokuapp.com http://client.augur.net http://localhost:8080" --maxpeers $maxpeers --etherbase $address --unlock $address --password $passfile console
