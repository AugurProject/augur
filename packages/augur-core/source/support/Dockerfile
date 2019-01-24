##
# Build a base package for augur-core.
#
# The build process is structured this way to encourage fail fast behavior so
# that this image's build will fail earlier for compiling contracts than
# for other pieces
FROM augurproject/python2-and-3:latest
#FROM python:3.6.6-stretch
ARG SOLC_VERSION=v0.4.24

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
	&& apt-get install -y nodejs

RUN wget --quiet --output-document /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/${SOLC_VERSION}/solc-static-linux \
	&& chmod a+x /usr/local/bin/solc

WORKDIR /app

COPY packages/augur-core/requirements.txt /app/requirements.txt

RUN /usr/local/bin/pip2 install --upgrade pip setuptools \
	&& /usr/local/bin/pip2 install --upgrade pip-tools \
	&& /usr/local/bin/pip2 install -r requirements.txt

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

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt update \
    && apt install -y yarn

RUN npm config set scripts-prepend-node-path true; yarn

# Lint
RUN yarn lint

# Build first chunk
RUN yarn build:source
RUN yarn build:contracts

# Build contract interfaces
RUN yarn build:interfaces

# Copy source
COPY packages/augur-core/source/ /app/source/
COPY packages/augur-core/tests/ /app/tests/

# Copy the git info so ContractDeployer can read the hash on deploy
RUN yarn build:source

ENTRYPOINT ["yarn"]
