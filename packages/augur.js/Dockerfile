##
# Use Builder pattern to compile the code
# using the node8 image which has python and such

FROM node:8 AS builder
# Copy augur.js repo into it and get it set up
WORKDIR /augur.js
COPY package.json package.json
RUN git init && npm install && rm -rf .git

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

COPY --from=builder /augur.js augur.js
WORKDIR /augur.js
COPY src src
COPY scripts scripts
COPY data data
RUN echo {} > /augur.js/src/contracts/addresses.json \
  && echo {} > /augur.js/src/contracts/upload-block-numbers.json


RUN bash scripts/run-geth-and-deploy.sh && rm -rf node_modules

EXPOSE 8545 8546 30303 30303/udp 30304/udp

WORKDIR /
ENTRYPOINT [ "/start.sh" ]
