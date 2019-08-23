#!/bin/bash
set -x

RPCPORT=8545
WSPORT=8546
if [[ "${ROOT}" == "" ]] ; then ROOT="/geth" ; fi
[[ "${UNLOCK_ACCOUNT}" != "" ]] || UNLOCK_ACCOUNT="0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb"

ROOT=$(readlink -f $ROOT)

setup_chain_template() {
  if [ ! -d "${ROOT}/chain-template" ]; then
    echo "Setting up Genesis with Network ID: ${NETWORK_ID:-12346}"
    sed -i'' -r "s/NETWORK_ID/${NETWORK_ID:-12346}/" ${ROOT}/genesis.json
    geth --datadir "${ROOT}/chain-template" --keystore "${ROOT}/keys" init "${ROOT}/genesis.json"

    echo ${NETWORK_ID:-12346} > "${ROOT}/networkid"
  fi
}

setup_chain_template

geth  --networkid "$(cat "$ROOT/networkid")"  --datadir "${ROOT}/chain"  --keystore "${ROOT}/keys"  --password "${ROOT}/password.txt"  --unlock "${UNLOCK_ACCOUNT}"  --verbosity ${GETH_VERBOSITY:-3} --mine  --ws --wsapi eth,net,web3,personal,txpool --wsaddr 0.0.0.0 --wsport $WSPORT --wsorigins '*'  --rpc --rpcapi eth,net,web3,personal,miner,txpool --rpcaddr 0.0.0.0 --rpcport $RPCPORT --rpccorsdomain '*' --rpcvhosts '*'  --targetgaslimit 6500000  --nodiscover
#geth
