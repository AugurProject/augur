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
