# Build a base package for augur-core.
FROM augurproject/augur-build:latest as augur-build

ARG SOLC_VERSION=v0.5.10
ARG SOLC_MD5=be02011efd6c6afd27cda02871bd70b3
ENV PATH="/augur/node_modules/.bin:${PATH}"
ENV PATH="/usr/bin:${PATH}"
ENV PATH="/augur/venv/bin:${PATH}"

# install "virtualenv", since the vast majority of users of this image will want it
RUN python3 -m pip install --no-cache-dir virtualenv

WORKDIR /augur
COPY packages/augur-core/requirements.txt /augur/
RUN python3 -m venv /augur/venv && \
    source /augur/venv/bin/activate && \
    python -m pip install --no-cache-dir -r requirements.txt

RUN echo "${SOLC_MD5} */usr/local/bin/solc" > solc.md5 && \
    curl -sL -o /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/${SOLC_VERSION}/solc-static-linux && \
    md5sum -b -c solc.md5 && \
    chmod a+x /usr/local/bin/solc

RUN yarn workspace @augurproject/core install && yarn workspace @augurproject/core build

FROM alpine:3.10
ENV PATH="/augur/venv/bin:${PATH}"

RUN apk add --no-cache \
    git \
    libstdc++ \
    python3

COPY --from=augur-build /usr/local/bin/solc /usr/local/bin/solc
COPY --from=augur-build /augur/packages/augur-core/ /augur/packages/augur-core
COPY --from=augur-build /augur/packages/augur-artifacts/ /augur/packages/augur-artifacts
COPY --from=augur-build /augur/packages/contract-dependencies/ /augur/packages/contract-dependencies
COPY --from=augur-build /augur/packages/contract-dependencies-ethers/ /augur/packages/contract-dependencies-ethers
COPY --from=augur-build /augur/package.json /augur
COPY --from=augur-build /augur/tsconfig.json /augur
COPY --from=augur-build /augur/tsconfig-base.json /augur
COPY --from=augur-build /augur/venv /augur/venv
COPY --from=augur-build /usr/local/ /usr/local
COPY --from=augur-build /opt/ /opt/

WORKDIR /augur/packages/augur-core

# install local modules so we can run integration tests
RUN yarn

#RUN apk del .build-deps

ENTRYPOINT ["yarn"]
