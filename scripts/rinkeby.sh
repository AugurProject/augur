#!/bin/bash

address="0x01114f4bda09ed6c6715cf0baf606b5bce1dc96a"
# address="0x95f75c360c056cf4e617f5ba2d9442706d6d43ed"
# address="0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"

geth --fast --rinkeby --datadir=$HOME/.rinkeby --cache=2048 --bootnodes=enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303 --rpc --rpcapi="eth,net,web3,admin,personal,miner,txpool" --rpccorsdomain='*' --ws --wsapi="eth,net,web3,admin,personal,miner,txpool" --wsport=8546 --wsorigins='*' --etherbase=$address --unlock=$address --password=$HOME/.rinkeby/.password console
