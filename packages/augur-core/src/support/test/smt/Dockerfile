FROM augurproject/augur-core:monorepo
# Enable SMT
RUN grep -lr "pragma solidity" src/contracts/ | xargs sed -i '1ipragma experimental SMTChecker;'

# Do not run SMT on quarantined contracts
COPY src/support/test/smt/quarantine.txt quarantine.txt
RUN while read contract; do sed -i '/pragma experimental SMTChecker/d' ${contract}; done<quarantine.txt

# Patch contract compiler to use SMT enabled solc instead of solc.js
COPY src/support/test/smt/smt.patch smt.patch
RUN git apply smt.patch

# Lint
RUN npm run lint

# Build first chunk
RUN npm run build:source
RUN npm run build:contracts

COPY src/libraries/ContractInterfacesGenerator.ts /app/src/libraries/ContractInterfacesGenerator.ts
COPY src/tools/generateContractInterfaces.ts /app/src/tools/generateContractInterfaces.ts

# Build contract interfaces
RUN npm run build:source
RUN npm run build:interfaces

# Copy source
COPY src/ /app/src/
COPY tests/ /app/tests/

# Copy the git info so ContractDeployer can read the hash on deploy
RUN npm run build:source

ENTRYPOINT ["npm"]
