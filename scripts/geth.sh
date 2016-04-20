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
genesis=""
optargs=""

if [ "${network}" = "2" ]; then
    optargs="--testnet --mine"
    address="0x15f6400a88fb320822b689607d425272bea2175f"
    # address="0x7c0d52faab596c08f484e3478aebc6205f3f5d8c"
elif [ "${network}" = "1" ]; then
    address="0x63524e3fe4791aefce1e932bbfb3fdf375bfad89"
elif [ "${network}" = "10101" ]; then
    # address="0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a"
    # address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
    # address="0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9"
    # address="0x2a7e417ff20606e384526ed42d306943caec2d24"
    optargs="--mine --minerthreads 1 --nodiscover"
    genesis="$HOME/src/augur.js/data/genesis-10101.json"
elif [ "${network}" = "7" ]; then
    optargs="--mine --minerthreads 1"
    genesis="$HOME/src/augur.js/data/genesis-7.json"
fi

if [ -L $symlink ]; then
    rm $symlink
fi
ln -s "$HOME/.ethereum-${network}" $symlink

# geth $optargs --networkid $network --datadir $symlink --rpc --rpcapi "eth,net,web3" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpccorsdomain "https://augur-dev.herokuapp.com http://augur-dev.herokuapp.com https://augur-exp.herokuapp.com http://augur-exp.herokuapp.com https://eth1.augur.net https://eth2.augur.net https://eth3.augur.net https://eth4.augur.net https://eth5.augur.net https://augur.divshot.io https://augur-stage.herokuapp.com https://client.augur.net http://localhost:8080 https://localhost:8080" --maxpeers $maxpeers --etherbase $address --unlock $address --password $passfile console
geth $optargs --cache 2048 --networkid $network --datadir $symlink --rpc --rpcapi "eth,net,web3,admin,personal" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpccorsdomain "http://local.augur.net,http://localhost:8080" --maxpeers $maxpeers --etherbase $address --unlock $address --password $passfile console
