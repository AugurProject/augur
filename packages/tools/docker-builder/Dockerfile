# pop-geth images
FROM augurproject/core:monorepo as core-builder

# using the augur image grab all repos
FROM augurproject/build:latest AS build

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

COPY --from=build /augur /augur
COPY --from=build /opt /opt
COPY --from=build /usr/local /usr/local
COPY --from=core-builder /augur/packages/core/output augur/packages/core/output
COPY --from=core-builder /augur/packages/core augur/packages/core
COPY --from=core-builder /augur/packages/core/output/contracts augur/packages/artifacts

RUN echo {} > /augur/packages/artifacts/addresses.json \
  && echo {} > /augur/packages/artifacts/upload-block-numbers.json

# TODO: a better way to do this using lerna natively?
RUN yarn link --cwd /augur/packages/core && cd /augur/packages/tools && yarn link @augurproject/core

RUN bash /augur/packages/tools/docker-builder/run-geth-and-deploy.sh


# create final image with no cruft
FROM augurproject/dev-node-geth:latest

RUN apk add --no-cache \
    bash \
    coreutils

WORKDIR /
COPY --from=geth /common_start.sh /common_start.sh
COPY --from=geth /start.sh /start.sh
COPY --from=geth /geth /geth
COPY --from=geth /augur/packages/artifacts /augur/packages/artifacts
COPY --from=build /opt /opt
COPY --from=build /usr/local /usr/local


EXPOSE 8545 8546 30303 30303/udp 30304/udp

WORKDIR /
ENTRYPOINT [ "/start.sh" ]
