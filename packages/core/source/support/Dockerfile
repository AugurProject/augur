# Build a base package for augur-core.
#
# The build process is structured this way to encourage fail fast behavior so
# that this image's build will fail earlier for compiling contracts than
# for other pieces
FROM augurproject/build:latest as build

FROM augurproject/python2-and-3:monorepo as core-build
ARG SOLC_VERSION=v0.5.4
ARG SOLC_MD5=fce0ea489308e86aa0d5f7d72bd2cd15
ENV PATH="/augur/node_modules/.bin:${PATH}"

COPY --from=build /usr/local/ /usr/local
COPY --from=build /opt/ /opt/

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


COPY --from=build /augur/ /augur/

WORKDIR /augur

RUN /usr/bin/virtualenv /augur/venv && \
    source /augur/venv/bin/activate && \
    cd packages/core && \
    python2 -m pip install --cache-dir=/augur/.pip -r requirements.txt

RUN yarn workspace @augurproject/core build

RUN apk add --no-cache \
    libstdc++

FROM augurproject/python2-and-3:monorepo
ENV PATH="/augur/venv/bin:${PATH}"

COPY --from=core-build /usr/local/bin/solc /usr/local/bin/solc
COPY --from=core-build /augur/packages/core/ /augur/packages/core
COPY --from=core-build /augur/packages/artifacts/ /augur/packages/artifacts
COPY --from=core-build /augur/package.json /augur
COPY --from=core-build /augur/tsconfig.json /augur
COPY --from=core-build /augur/tsconfig-base.json /augur
COPY --from=core-build /augur/venv /augur/venv
COPY --from=build /usr/local/ /usr/local
COPY --from=build /opt/ /opt/

WORKDIR /augur/packages/core

# install local modules so we can run integration tests
RUN yarn

#RUN apk del .build-deps

ENTRYPOINT ["yarn"]
