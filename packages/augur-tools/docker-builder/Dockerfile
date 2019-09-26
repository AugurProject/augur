FROM augurproject/dev-node-geth:latest

RUN apk add --no-cache \
    bash \
    coreutils

WORKDIR /
COPY  geth /
COPY  packages/augur-artifacts /augur/packages/augur-artifacts

EXPOSE 8545 8546 30303 30303/udp 30304/udp

WORKDIR /
ENTRYPOINT [ "/start.sh" ]
