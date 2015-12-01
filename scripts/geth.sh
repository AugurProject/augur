#!/bin/bash
# geth startup script

set -e
trap "exit" INT

address="0x639b41c4d3d399894f2a57894278e1653e7cd24c"
maxpeers="64"
network="${1}"
symlink="$HOME/.ethereum"
passfile="${symlink}/.password"
bootnodes=""
optargs=""

if [ "${network}" = "10101" ]; then
    address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"
    # address="0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9"
    # address="0x2a7e417ff20606e384526ed42d306943caec2d24"
    optargs="--mine --nodiscover"
else
    bootnodes="enode://70eb80f63946c2b3f65e68311b4419a80c78271c099a7d1f3d8df8cdd8e374934c795d8bc9f204dda21eb9a318d30197ba7593494eb27ceb52663c8339e9cb70@[::]:30303 enode://405e781c84b570f02cb2e4ebb18c60528aba5a08ccd72d4ebd7aeabc09208ef24fa54e20ff3b10e478c203dd481f3820242e51fe72770a207a798eadfe8e7e6e@[::]:30303 enode://d4f4e7fd3954718562544dbf322c0c84d2c87f154dd66a39ea0787a6f74930c42f5d13ba2cfef481b66a6f002bc3915f94964f67251524696a448ba40d1e2b12@[::]:30303 enode://8f3c33294774dc266446e9c8483fa1a21a49b157d2066717fd52e76d00fb4ed771ad215631f9306db2e5a711884fe436bc0ca082684067836b3b54730a6c3995@[::]:30303 enode://4f23a991ea8739bcc5ab52625407fcfddb03ac31a36141184cf9072ff8bf399954bb94ec47e1f653a0b0fea8d88a67fa3147dbe5c56067f39e0bd5125ae0d1f1@[::]:30303 enode://bafc7bbaebf6452dcbf9522a2af30f586b38c72c84922616eacad686ab6aaed2b50f808b3f91dba6a546474fe96b5bff97d51c9b062b4a2e8bc9339d9bb8e186@[::]:30303"
fi

if [ -L $symlink ]; then
    rm $symlink
fi
ln -s "$HOME/.ethereum-${network}" $symlink

geth $optargs --networkid $network --datadir $symlink --rpc --rpcapi "eth,net,web3" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpccorsdomain "https://eth1.augur.net https://eth2.augur.net https://eth3.augur.net https://eth4.augur.net https://eth5.augur.net https://augur.divshot.io https://augur-stage.herokuapp.com https://client.augur.net http://localhost:8080 https://localhost:8080" --bootnodes "${bootnodes}" --maxpeers $maxpeers --etherbase $address --unlock $address --password $passfile console
