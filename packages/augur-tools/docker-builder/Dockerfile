# populated geth docker file
FROM augurproject/dev-node-geth:v1.9.19 as geth

ARG normal_time=true
ENV NORMAL_TIME=$normal_time

ARG network_id=101
ARG period_time=5

ENV NETWORK_ID=$network_id
ENV PERIOD_TIME=$period_time
ENV NODE_OPTIONS="--max_old_space_size=8192"

RUN apk add --no-cache \
    alpine-sdk \
    bash \
    curl \
    eudev-dev \
    git \
    libstdc++ \
    linux-headers \
    nodejs \
    python2 \
    python3 \
    yarn

COPY . /augur

WORKDIR /augur


RUN yarn install --frozen-lockfile && yarn build

RUN bash /augur/packages/augur-tools/docker-builder/run-geth-and-deploy.sh

#RUN find /geth -name geth.ipc -delete

# create final image with no cruft
FROM augurproject/dev-node-geth:v1.9.19

RUN apk add --no-cache \
    bash \
    coreutils

WORKDIR /
COPY --from=geth /geth /geth
COPY --from=geth /augur/packages/augur-artifacts /augur/packages/augur-artifacts
COPY --from=geth /augur/*.txt /augur/

EXPOSE 8545 8546 30303 30303/udp 30304/udp

ENTRYPOINT ["/start.sh" ]
