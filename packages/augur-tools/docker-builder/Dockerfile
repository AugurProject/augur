##
# Use Builder pattern to compile the code
# use latest build augur-core for it's output dir
FROM augurproject/augur-core:latest as core-builder
WORKDIR /app
ADD ./ .

# using the augur image grab all repos
FROM augurproject/augur:latest AS builder
WORKDIR /augur
ADD ./ .

##
# Now with our geth node
FROM augurproject/dev-node-geth:latest

ARG normal_time=false
ENV USE_NORMAL_TIME=$normal_time

ARG network_id=101
ARG period_time=1

ENV NETWORK_ID=$network_id
ENV PERIOD_TIME=$period_time

# Install Node
RUN apk update \
  && apk upgrade \
  && apk add curl
  #&& apk add nodejs nodejs-npm


COPY --from=builder /augur augur
COPY --from=core-builder /app/output augur/packages/augur-core/output
COPY --from=core-builder /app/output/contracts augur/packages/augur-artifacts

RUN echo {} > /augur/packages/augur-artifacts/addresses.json \
  && echo {} > /augur/packages/augur-artifacts/upload-block-numbers.json

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 10.15.0

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install nvm with node and npm
WORKDIR /augur/packages/augur-tools
RUN mkdir $NVM_DIR && \
    curl https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    nvm use --delete-prefix $NODE_VERSION \
    nvm alias default node \
    bash docker-builder/run-geth-and-deploy.sh

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH


EXPOSE 8545 8546 30303 30303/udp 30304/udp

WORKDIR /
ENTRYPOINT [ "/start.sh" ]
