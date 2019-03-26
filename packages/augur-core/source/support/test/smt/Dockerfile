##
# Build a base package for augur-core.
#
# The build process is structured this way to encourage fail fast behavior so
# that this image's build will fail earlier for compiling contracts than
# for other pieces
#FROM augurproject/augur-build:latest as augur-build
#
#FROM augurproject/python2-and-3:monorepo as core-build
#ARG SOLC_VERSION=v0.5.4
#ARG SOLC_MD5=fce0ea489308e86aa0d5f7d72bd2cd15
#
#COPY --from=augur-build /usr/local/ /usr/local
#COPY --from=augur-build /opt/ /opt/
#
#RUN apk add --no-cache --update \
#        bash \
#        curl \
#        g++ \
#        gcc \
#        git \
#        libffi-dev \
#        linux-headers \
#        make \
#        musl-dev \
#        openssl-dev \
#        python2-dev
#
#RUN echo "${SOLC_MD5} */usr/local/bin/solc" > solc.md5 && \
#    curl -sL -o /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/${SOLC_VERSION}/solc-static-linux && \
#    md5sum -b -c solc.md5 && \
#    chmod a+x /usr/local/bin/solc
#
#
#COPY --from=augur-build /augur/packages/augur-core/ /augur/packages/augur-core
#COPY --from=augur-build /augur/packages/augur-artifacts/ /augur/packages/augur-artifacts
#COPY --from=augur-build /augur/packages/augur-types/ /augur/packages/augur-types
#COPY --from=augur-build /augur/package.json .
#COPY --from=augur-build /augur/tsconfig.json .
#COPY --from=augur-build /augur/tsconfig-base.json .
#
#WORKDIR /augur
#
#RUN cd packages/augur-core && \
#    python2 -m pip install --cache-dir=.pip -r requirements.txt

FROM augurproject/augur-core:monorepo
# Enable SMT
RUN grep -lr "pragma solidity" source/contracts/ | xargs sed -i '1ipragma experimental SMTChecker;'

# Do not run SMT on quarantined contracts
COPY source/support/test/smt/quarantine.txt quarantine.txt
RUN while read contract; do sed -i '/pragma experimental SMTChecker/d' ${contract}; done<quarantine.txt

# Patch contract compiler to use SMT enabled solc instead of solc.js
COPY source/support/test/smt/smt.patch smt.patch
RUN git apply smt.patch

# Lint
RUN npm run lint

# Build first chunk
RUN npm run build:source
RUN npm run build:contracts

COPY source/libraries/ContractInterfacesGenerator.ts /app/source/libraries/ContractInterfacesGenerator.ts
COPY source/tools/generateContractInterfaces.ts /app/source/tools/generateContractInterfaces.ts

# Build contract interfaces
RUN npm run build:source
RUN npm run build:interfaces

# Copy source
COPY source/ /app/source/
COPY tests/ /app/tests/

# Copy the git info so ContractDeployer can read the hash on deploy
RUN npm run build:source

ENTRYPOINT ["npm"]
