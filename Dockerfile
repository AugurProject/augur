FROM node:8.14.0-alpine
ARG SOLC_VERSION=v0.4.24
ARG SOLC_MD5=dc791cd7db87b7df5e47975d222dc5fe

RUN apk add --update \
    python \
    python3 \
    python-dev \
    py-pip \
    git \
    curl \
    bash \
    musl \
    libressl-dev \
    libc6-compat \
    linux-headers \
    build-base \
    gmp-dev \
    libffi-dev \
    libusb-dev \
    fakeroot \
    rpm \
    dpkg \
    tar

RUN echo "${SOLC_MD5} */usr/local/bin/solc" > solc.md5 && \
    curl -sL -o /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/${SOLC_VERSION}/solc-static-linux && \
    md5sum -b -c solc.md5 && \
    chmod a+x /usr/local/bin/solc

RUN yarn config set cache-folder .yarn && \
    yarn global add lerna && \
    yarn global add yarn@1.9.4

ADD packages/augur-core/requirements.txt requirements.txt
RUN pip install --upgrade pip setuptools && \
    pip install --upgrade pip-tools && \
    pip install -r requirements.txt
