ARG GETH_VERSION=v1.8.27
FROM ethereum/client-go:$GETH_VERSION

RUN apk update \
    && apk add bash curl coreutils

COPY genesis.json /geth/genesis.json
COPY password.txt /geth/password.txt
ADD keys /geth/keys

WORKDIR /
COPY ./common_start.sh /common_start.sh
COPY start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT [ "/start.sh" ]

# start.sh uses ENV variables
#   NETWORK_ID to set chain id, default=12346
#   PERIOD_TIME to set period, block time in seconds. Default=0, instant seal
# docker image build --tag augurproject/geth-dev-node .
# docker push augurproject/geth-dev-node:latest
# docker container run --rm -it -p 8545:8545 --name geth-dev-node geth-dev-node
#-p 8545:8545 ethereum/client-go --dev --ws --wsapi eth,net,web3,personal,txpool --wsport 8546 --rpc --rpcapi eth,net,web3,personal,miner,txpool --rpcaddr 0.0.0.0 --targetgaslimit 7500000
# To connect in a separate terminal: geth attach http://127.0.0.1:8545
# To persist the chain, volume mount over /geth/chain, such as `-v $HOME/.geth-chain:/geth/chain`
