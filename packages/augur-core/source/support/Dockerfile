# Build a base package for augur-core.
#
# The build process is structured this way to encourage fail fast behavior so
# that this image's build will fail earlier for compiling contracts than
# for other pieces
FROM augurproject/augur-build:latest as augur-build

FROM augurproject/python2-and-3:monorepo as core-build
ARG SOLC_VERSION=v0.5.4
ARG SOLC_MD5=fce0ea489308e86aa0d5f7d72bd2cd15
ENV PATH="/augur/node_modules/.bin:${PATH}"



WORKDIR /augur
COPY packages/augur-core/requirements.txt /augur/
RUN python3 -m venv /augur/venv && \
    source /augur/venv/bin/activate && \
    python -m pip install --cache-dir=/root/.pip -r requirements.txt


RUN echo "${SOLC_MD5} */usr/local/bin/solc" > solc.md5 && \
    curl -sL -o /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/${SOLC_VERSION}/solc-static-linux && \
    md5sum -b -c solc.md5 && \
    chmod a+x /usr/local/bin/solc

COPY --from=augur-build /usr/local/ /usr/local
COPY --from=augur-build /opt/ /opt/

COPY --from=augur-build /augur/ /augur/

RUN yarn workspace @augurproject/core build

RUN apk add --no-cache \
    libstdc++

FROM augurproject/python2-and-3:monorepo
ENV PATH="/augur/venv/bin:${PATH}"

COPY --from=core-build /usr/local/bin/solc /usr/local/bin/solc
COPY --from=core-build /augur/packages/augur-core/ /augur/packages/augur-core
COPY --from=core-build /augur/packages/augur-artifacts/ /augur/packages/augur-artifacts
COPY --from=core-build /augur/package.json /augur
COPY --from=core-build /augur/tsconfig.json /augur
COPY --from=core-build /augur/tsconfig-base.json /augur
COPY --from=core-build /augur/venv /augur/venv
COPY --from=augur-build /usr/local/ /usr/local
COPY --from=augur-build /opt/ /opt/

WORKDIR /augur/packages/augur-core

# install local modules so we can run integration tests
RUN yarn

#RUN apk del .build-deps

ENTRYPOINT ["yarn"]
