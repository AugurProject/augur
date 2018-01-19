#!/bin/bash

# extended pattern matching
shopt -s extglob

if [[ "${SOURCE}x" == "x" ]]; then
  echo "SOURCE environment variable required with path to augur-core/output/contracts"
  exit 1
fi

npx dotsunited-merge-json ./source/contracts/addresses.json $SOURCE/addresses.json | npx jq.node --color=false --json > ./updated.json
[[ $? == 0 ]] || exit 1
mv updated.json ./source/contracts/addresses.json

npx dotsunited-merge-json ./source/contracts/upload-block-numbers.json $SOURCE/upload-block-numbers.json | npx jq.node --color=false --json > ./updated.json
[[ $? == 0 ]] || exit 1
mv updated.json ./source/contracts/upload-block-numbers.json

cat $SOURCE/abi.json ./source/contracts/abi.json
[[ $? == 0 ]] || exit 1

if [[ "$AUTOCOMMIT" == "true" ]]; then
  git add addresses.json abi.json upload-block-numbers.json
  git commit -m "Auto-updating from push to augur-core#${BRANCH} (${COMMIT})"

  case $BRANCH in
    master | v+([0-9]).+([0-9]).+([0-9])?(-+([0-9])))
      # Commit on a tag, this will do all the work of commiting and pushing
      # a new release
      echo "Update master of augur.js, and publishing new NPM version"
      npm version --force prerelease
      git push && git push --tags && npm publish --tag dev
      ;;
    develop)
      echo "Updating develop branch of augur.js with force push"
      git checkout -B $BRANCH origin/$BRANCH
      git push --force-with-lease
      ;;
    *)
      echo "Making new branch (augur-core/${BRANCH}) on augur.js to match ${BRANCH}"
      git checkout -B augur-core/$BRANCH
      git push origin augur-core/$BRANCH --force-with-lease
      ;;
  esac
else
  echo "Files updated, commit and push manually"
fi
