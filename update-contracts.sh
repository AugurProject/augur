#!/bin/bash

#exit 0 #Skip

# extended pattern matching
shopt -s extglob

npm install
npm install augur-contracts@dev || exit 0
npm upgrade augur-contracts


if [[ "$AUTOCOMMIT" == "true" ]]; then
  git add package.json package-lock.json
  git commit -m "Auto-updating from push to augur-core#${BRANCH} (${COMMIT})"

  case $BRANCH in
    v+([0-9]).+([0-9]).+([0-9])?(-+([0-9])))
      if [[ "$BRANCH" == "$TAG" ]]; then
        # Commit on a tag, this will do all the work of commiting and pushing
        # a new release
        echo "Update master of augur-contracts, and publishing new NPM version"
        npm version prerelease
        git tag augur-core/$TAG # create a tag to match the augur-core tag
        git push && git push --tags && npm publish --tag dev
      fi
      ;;
    master)
      echo "Update master of augur-contracts, manual NPM release needed"
      git push
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
