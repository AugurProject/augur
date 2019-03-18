##
# Build a base package for augur-core.
#
# The build process is structured this way to encourage fail fast behavior so
# that this image's build will fail earlier for compiling contracts than
# for other pieces
FROM augurproject/augur-build:latest as augur-build

WORKDIR /augur

RUN yarn && yarn build

FROM augurproject/python2-and-3:monorepo
ARG SOLC_VERSION=v0.5.4

COPY --from=augur-build /usr/local/ /usr/local
COPY --from=augur-build /opt/ /opt/

RUN apk add --no-cache --virtual .build-deps \
        bash \
        gcc \
        g++ \
        git \
        libffi-dev \
        linux-headers \
        make \
        musl-dev \
        openssl-dev \
        python2-dev

RUN wget --quiet --output-document /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/${SOLC_VERSION}/solc-static-linux \
	&& chmod a+x /usr/local/bin/solc

WORKDIR /augur


COPY --from=augur-build /augur/packages/augur-core/ packages/augur-core
COPY --from=augur-build /augur/packages/augur-artifacts/ packages/augur-artifacts
COPY --from=augur-build /augur/packages/augur-types/ packages/augur-types
COPY --from=augur-build /augur/package.json .
COPY --from=augur-build /augur/tsconfig.json .
COPY --from=augur-build /augur/tsconfig-base.json .


RUN cd packages/augur-core && \
    python2 -m pip install --cache-dir=.pip pip setuptools && \
    python2 -m pip install --cache-dir=.pip pip-tools && \
    python2 -m pip install --cache-dir=.pip -r requirements.txt


# Yarn and Lint
RUN yarn workspace @augurproject/core && yarn workspace @augurproject/core lint

# Build first chunk
RUN yarn workspace @augurproject/core build:source

# Build contracts and interfaces
RUN yarn workspace @augurproject/core build:interfaces

# Final build
RUN yarn workspace @augurproject/core build:source
RUN apk add --no-cache \
    libstdc++

WORKDIR packages/augur-core

#RUN apk del .build-deps

ENTRYPOINT ["yarn"]
