FROM node:8.11.2-alpine
ARG SOLC_VERSION=v0.4.20
ARG SOLC_MD5=ae7047eb018ec59d241b478ae6ea1f8a

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
    yarn global add yarn@1.6.0

ADD packages/augur-core/requirements.txt requirements.txt
RUN pip install --upgrade pip setuptools && \
    pip install --upgrade pip-tools && \
    pip install -r requirements.txt
