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

COPY augur-core/requirements.txt /app/requirements.txt

RUN /usr/local/bin/pip2 install --upgrade pip setuptools \
	&& /usr/local/bin/pip2 install --upgrade pip-tools \
	&& /usr/local/bin/pip2 install -r requirements.txt

# Install basics of the application
COPY augur-core/.soliumrc.json /app/.soliumrc.json
COPY augur-core/.soliumignore /app/.soliumignore
COPY augur-core/tsconfig.json /app/tsconfig.json
COPY augur-core/source/contracts/ /app/source/contracts/
COPY augur-types/ /augur-types
COPY augur-core/source/deployment/compileContracts.ts /app/source/deployment/compileContracts.ts
COPY augur-core/source/libraries/ /app/source/libraries/
COPY augur-core/source/tools/ /app/source/tools/
COPY augur-core/package.json /app/package.json

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt update \
    && apt install -y yarn

RUN yarn

# Lint
RUN yarn lint

# Build first chunk
RUN yarn build:source
RUN yarn build:contracts

# Build contract interfaces
RUN yarn build:interfaces

# Copy source
COPY augur-core/source/ /app/source/
COPY augur-core/tests/ /app/tests/

# Copy the git info so ContractDeployer can read the hash on deploy
RUN yarn build:source

ENTRYPOINT ["yarn"]
