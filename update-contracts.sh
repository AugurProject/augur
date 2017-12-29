#!/bin/bash

#exit 0 #Skip

# extended pattern matching
shopt -s extglob

npm install
npm install --save-exact augur-contracts@dev || exit 0


if [[ "$AUTOCOMMIT" == "true" ]]; then
  git add package.json package-lock.json
  git commit -m "Auto-updating from push to augur-core#${BRANCH} (${COMMIT})"

  case $BRANCH in
    master | v+([0-9]).+([0-9]).+([0-9])?(-+([0-9])))
      echo "Update master of augur-contracts, and publishing new NPM version"
      npm version prerelease
      git push && git push --tags && npm publish --tag dev
      ;;
    develop)
      echo "Updating develop branch of augur-contracts with force push"
      git checkout -B $BRANCH origin/$BRANCH
      git push --force-with-lease
      ;;
    *)
      echo "Making new branch (augur-core/${BRANCH}) on augur-contracts to match ${BRANCH}"
      git checkout -B augur-core/$BRANCH
      git push origin augur-core/$BRANCH --force-with-lease
      ;;
  esac
else
  echo "Files updated, commit and push manually"
fi
