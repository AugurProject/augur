# when updating node version, make sure link to yarn in /opt is still the correct version
ARG NODE_VERSION=10.16
FROM node:${NODE_VERSION}-alpine as base

RUN apk add --no-cache \
        bash \
        curl \
        g++ \
        gcc \
        git \
        libffi-dev \
        libstdc++ \
        linux-headers \
        make \
        musl-dev \
        openssl-dev

WORKDIR /augur
COPY . .

# The private keys for the account will live here.
VOLUME /keys

RUN yarn && yarn build

RUN cd packages/orbit-web; ./node_modules/.bin/webpack --mode=production; cd -;

ENTRYPOINT /augur/support/entrypoint.sh
