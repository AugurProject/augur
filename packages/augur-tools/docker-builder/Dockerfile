##
# Use Builder pattern to compile the code
# use latest build augur-core for it's output dir
FROM augurproject/augur-core:latest as core-builder
WORKDIR /app
ADD ./ .

# using the node10 image which has python and such
FROM node:10.13.0 AS builder
# Copy augur repo into it and get it set up
WORKDIR /augur
ADD ./ .
RUN yarn

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
  && apk add nodejs nodejs-npm

COPY --from=builder /augur augur
COPY --from=core-builder /app/output augur/packages/augur-core/output
COPY --from=core-builder /app/output/contracts augur/packages/augur-artifacts

RUN echo {} > /augur/packages/augur-artifacts/addresses.json \
  && echo {} > /augur/packages/augur-artifacts/upload-block-numbers.json

WORKDIR /augur/packages/augur-tools
RUN bash docker-builder/run-geth-and-deploy.sh && rm -rf node_modules

EXPOSE 8545 8546 30303 30303/udp 30304/udp

WORKDIR /
ENTRYPOINT [ "/start.sh" ]
