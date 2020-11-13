# when updating node version, make sure link to yarn in /opt is still the correct version
ARG NODE_VERSION=12.18
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

ARG CURRENT_VERSION
ENV CURRENT_VERSION=$CURRENT_VERSION
ARG CURRENT_COMMITHASH="COMMIT HASH NOT AVAILABLE"
ENV CURRENT_COMMITHASH=$CURRENT_COMMITHASH

WORKDIR /augur
COPY . .

# The private keys for the account will live here.
VOLUME /keys

RUN yarn && yarn build

ENTRYPOINT /augur/support/entrypoint.sh
