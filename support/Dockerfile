# when updating node version, make sure link to yarn in /opt is still the correct version
ARG NODE_VERSION=10.15.3
FROM node:${NODE_VERSION}-alpine

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
        openssl-dev \
        python-dev \
        python3-dev


WORKDIR /augur
COPY . .

RUN yarn && yarn build

