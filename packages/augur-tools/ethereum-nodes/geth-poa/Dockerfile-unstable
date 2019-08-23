FROM ethereum/client-go:latest

RUN apk update \
    && apk add bash curl

COPY genesis.json /geth/genesis.json
COPY password.txt /geth/password.txt
ADD keys /geth/keys
RUN geth --datadir /geth/chain --keystore /geth/keys init /geth/genesis.json

WORKDIR /
COPY ./common_start.sh /common_start.sh
COPY start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT [ "/start.sh" ]

# docker image build --tag geth-dev-node .
# docker container run --rm -it -p 8545:8545 --name geth-dev-node geth-dev-node
#-p 8545:8545 ethereum/client-go --dev --ws --wsapi eth,net,web3,personal,txpool --wsport 8546 --rpc --rpcapi eth,net,web3,personal,miner,txpool --rpcaddr 0.0.0.0 --targetgaslimit 7500000
# To connect in a separate terminal: geth attach http://127.0.0.1:8545
