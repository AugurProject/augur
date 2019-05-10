# pop-geth images
FROM augurproject/augur-core:monorepo as core-builder

# using the augur image grab all repos
FROM augurproject/augur-build:latest AS augur-build

##
# Now with our geth node
FROM augurproject/dev-node-geth:latest as geth

ARG normal_time=false
ENV USE_NORMAL_TIME=$normal_time

ARG network_id=101
ARG period_time=5

ENV NETWORK_ID=$network_id
ENV PERIOD_TIME=$period_time

RUN apk add --no-cache \
    bash \
    curl \
    libstdc++

COPY --from=augur-build /augur /augur
COPY --from=augur-build /opt /opt
COPY --from=augur-build /usr/local /usr/local
COPY --from=core-builder /augur/packages/augur-core/output augur/packages/augur-core/output
COPY --from=core-builder /augur/packages/augur-core augur/packages/augur-core
COPY --from=core-builder /augur/packages/augur-core/output/contracts augur/packages/augur-artifacts/src

RUN echo {} > /augur/packages/augur-artifacts/src/addresses.json \
  && echo {} > /augur/packages/augur-artifacts/src/upload-block-numbers.json

# TODO: a better way to do this using lerna natively?
RUN yarn link --cwd /augur/packages/augur-core && cd /augur/packages/augur-tools && yarn link @augurproject/core

RUN bash /augur/packages/augur-tools/docker-builder/run-geth-and-deploy.sh


# create final image with no cruft
FROM augurproject/dev-node-geth:latest

RUN apk add --no-cache \
    bash \
    coreutils

WORKDIR /
COPY --from=geth /common_start.sh /common_start.sh
COPY --from=geth /start.sh /start.sh
COPY --from=geth /geth /geth
COPY --from=geth /augur/packages/augur-artifacts /augur/packages/augur-artifacts
COPY --from=geth /augur/*.txt /augur/
COPY --from=augur-build /opt /opt
COPY --from=augur-build /usr/local /usr/local


EXPOSE 8545 8546 30303 30303/udp 30304/udp

WORKDIR /
ENTRYPOINT [ "/start.sh" ]
