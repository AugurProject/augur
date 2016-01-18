#!/bin/bash
# geth startup script

set -e
trap "exit" INT

if [ `hostname` = "heavy" ]; then
    address="0xab50dcce6c36a033dc4a3b451d23868c909afbd6"
else
    address="0x639b41c4d3d399894f2a57894278e1653e7cd24c"
    # address="0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9"
fi
maxpeers="64"
network="${1}"
symlink="$HOME/.ethereum"
passfile="${symlink}/.password"
bootnodes=""
genesis=""
optargs="--nodiscover"

if [ "${network}" = "10101" ]; then
    # address="0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a"
    address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
    # address="0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9"
    # address="0x2a7e417ff20606e384526ed42d306943caec2d24"
    optargs="--mine --nodiscover"
    genesis="$HOME/src/augur.js/data/genesis-10101.json"
else
    genesis="$HOME/src/augur.js/data/genesis7.json"
    # vent: 70eb80f63946c2b3f65e68311b4419a80c78271c099a7d1f3d8df8cdd8e374934c795d8bc9f204dda21eb9a318d30197ba7593494eb27ceb52663c8339e9cb70
    # heavy: 9c3de1a912e7db6b46b10597cc0f1270e8b15d43c8f4ae003452c987133aea5845bf307fdfe1ec99a77af74027522e4a107196af1af51fab7840b1b708ca260e
    # eth1: enode://d4f4e7fd3954718562544dbf322c0c84d2c87f154dd66a39ea0787a6f74930c42f5d13ba2cfef481b66a6f002bc3915f94964f67251524696a448ba40d1e2b12@45.33.59.27:30303
    # eth3: enode://a9f34ea3de79cd75ba49c37603d28a7c494f32604b4ad6e3415b4c6020ff5bf38f9772d69362c024355245fe839dd397ff9ec04db70b3258d92259323cb792ae@69.164.196.239:30303
    # eth4: enode://4f23a991ea8739bcc5ab52625407fcfddb03ac31a36141184cf9072ff8bf399954bb94ec47e1f653a0b0fea8d88a67fa3147dbe5c56067f39e0bd5125ae0d1f1@139.162.5.153:30303
    # eth5: enode://bafc7bbaebf6452dcbf9522a2af30f586b38c72c84922616eacad686ab6aaed2b50f808b3f91dba6a546474fe96b5bff97d51c9b062b4a2e8bc9339d9bb8e186@106.184.4.123:30303
    bootnodes="enode://d4f4e7fd3954718562544dbf322c0c84d2c87f154dd66a39ea0787a6f74930c42f5d13ba2cfef481b66a6f002bc3915f94964f67251524696a448ba40d1e2b12@45.33.59.27:30303,enode://a9f34ea3de79cd75ba49c37603d28a7c494f32604b4ad6e3415b4c6020ff5bf38f9772d69362c024355245fe839dd397ff9ec04db70b3258d92259323cb792ae@69.164.196.239:30303,enode://4f23a991ea8739bcc5ab52625407fcfddb03ac31a36141184cf9072ff8bf399954bb94ec47e1f653a0b0fea8d88a67fa3147dbe5c56067f39e0bd5125ae0d1f1@139.162.5.153:30303,enode://bafc7bbaebf6452dcbf9522a2af30f586b38c72c84922616eacad686ab6aaed2b50f808b3f91dba6a546474fe96b5bff97d51c9b062b4a2e8bc9339d9bb8e186@106.184.4.123:30303"
fi

if [ -L $symlink ]; then
    rm $symlink
fi
ln -s "$HOME/.ethereum-${network}" $symlink

geth $optargs --networkid $network --datadir $symlink --rpc --rpcapi "eth,net,web3" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpccorsdomain "https://augur-dev.herokuapp.com http://augur-dev.herokuapp.com https://augur-exp.herokuapp.com http://augur-exp.herokuapp.com https://eth1.augur.net https://eth2.augur.net https://eth3.augur.net https://eth4.augur.net https://eth5.augur.net https://augur.divshot.io https://augur-stage.herokuapp.com https://client.augur.net http://localhost:8080 https://localhost:8080" --genesis "${genesis}" --bootnodes "${bootnodes}" --maxpeers $maxpeers --etherbase $address --unlock $address --password $passfile console
