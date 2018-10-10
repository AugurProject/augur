#!/bin/bash

npm run deploy -- $@           || exit 1
npm run canned-network -- $@   || exit 1

cat << EOF

===============================================================================
Deployment and market canning done for ${@}
===============================================================================

If you will be creating a new release of augur.js based on this deploy remember
to commit the updated files located in src/contracts.

If you want to release immediately, execute the following:

--
git add src/contracts/addresses.json
git add src/contracts/upload-block-numbers.json
git commit -m "New Deploy"

# Add / Commit any other files that you need to include in this release

npm run release:dev
--
EOF
