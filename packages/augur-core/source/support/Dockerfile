##
# Build a base package for augur-core.
#
# The build process is structured this way to encourage fail fast behavior so
# that this image's build will fail earlier for compiling contracts than
# for other pieces
FROM augurproject/augur-build:latest as augur-build

FROM augurproject/python2-and-3:monorepo as core-build
ARG SOLC_VERSION=v0.5.4
ARG SOLC_MD5=fce0ea489308e86aa0d5f7d72bd2cd15

COPY --from=augur-build /usr/local/ /usr/local
COPY --from=augur-build /opt/ /opt/

RUN apk add --no-cache --update \
        bash \
        curl \
        g++ \
        gcc \
        git \
        libffi-dev \
        linux-headers \
        make \
        musl-dev \
        openssl-dev \
        python2-dev

RUN echo "${SOLC_MD5} */usr/local/bin/solc" > solc.md5 && \
    curl -sL -o /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/${SOLC_VERSION}/solc-static-linux && \
    md5sum -b -c solc.md5 && \
    chmod a+x /usr/local/bin/solc


COPY --from=augur-build /augur/ /augur/

WORKDIR /augur

RUN cd packages/augur-core && \
    python2 -m pip install --cache-dir=.pip -r requirements.txt

# Yarn and Lint
RUN yarn workspace @augurproject/core lint

# Build first chunk
RUN yarn workspace @augurproject/core build:source

# Build contracts and interfaces
RUN yarn workspace @augurproject/core build:interfaces

# Final build
RUN yarn workspace @augurproject/core build:source
RUN apk add --no-cache \
    libstdc++

FROM augurproject/python2-and-3:monorepo

COPY --from=core-build /augur/packages/augur-core/ /augur/packages/augur-core
COPY --from=core-build /augur/packages/augur-artifacts/ /augur/packages/augur-artifacts
COPY --from=core-build /augur/package.json /augur
COPY --from=core-build /augur/tsconfig.json /augur
COPY --from=core-build /augur/tsconfig-base.json /augur
COPY --from=augur-build /usr/local/ /usr/local
COPY --from=augur-build /opt/ /opt/

WORKDIR /augur/packages/augur-core

#RUN apk del .build-deps

ENTRYPOINT ["yarn"]
