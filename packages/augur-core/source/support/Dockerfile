##
# Build a base package for augur-core.
#
# The build process is structured this way to encourage fail fast behavior so
# that this image's build will fail earlier for compiling contracts than
# for other pieces
FROM augurproject/augur-build:latest as augur-build


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

WORKDIR /app

COPY packages/augur-core/requirements.txt /app/requirements.txt

RUN python2 -m pip install --upgrade pip setuptools \
    && python2 -m pip install --upgrade pip-tools \
    && python2 -m pip install -r requirements.txt


# Install basics of the application
COPY packages/augur-core/.soliumrc.json /app/.soliumrc.json
COPY packages/augur-core/.soliumignore /app/.soliumignore
COPY packages/augur-core/docker.tsconfig.json /app/tsconfig.json
COPY packages/augur-core/source/contracts/ /app/source/contracts/
COPY packages/augur-types/ /augur-types
COPY packages/augur-core/source/deployment/compileContracts.ts /app/source/deployment/compileContracts.ts
COPY packages/augur-core/source/libraries/ /app/source/libraries/
COPY packages/augur-core/source/tools/ /app/source/tools/
COPY packages/augur-core/package.json /app/package.json
COPY packages/augur-core/.babelrc.js /app/.babelrc.js
COPY packages/augur-core/jest.config.js /app/jest.config.js

# Copy source
COPY packages/augur-core/source/ /app/source/
COPY packages/augur-core/tests/ /app/tests/

RUN yarn && yarn lint

# cleanup


# Lint
# RUN yarn lint

# Build first chunk
RUN yarn build:source
RUN yarn build:contracts

# Build contract interfaces
RUN yarn build:interfaces


# Copy the git info so ContractDeployer can read the hash on deploy
RUN yarn build:source


RUN apk add --no-cache \
    libstdc++

#RUN apk del .build-deps

ENTRYPOINT ["yarn"]
