#!/bin/bash
#set -ex

SCRIPT_DIR=$(dirname "$(realpath "$0")")
GET_VERSION="node $SCRIPT_DIR/get-version.js"
NPM_VERSION=${NPM_VERSION:-patch}
POST_RELEASE_VERSION=${NPM_VERSION:-patch}
CURRENT_VERSION="$($GET_VERSION ../package.json)"
RELEASE_VERSION="${VERSION%-snapshot}"
RELEASE_BRANCH="release-$RELEASE_VERSION"

# removes -snapshot from version
npm version --no-git-tag-version $NPM_VERSION > /dev/null

# increment NPM_VERSION version
NEW_SNAPSHOT_VERSION=$(npm version --no-git-tag-version $POST_RELEASE_VERSION)-snapshot

# set snapshot version
#NEW_SNAPSHOT_VERSION=$($GET_VERSION ../package.json)-snapshot
npm version --no-git-tag-version $NEW_SNAPSHOT_VERSION

# show change in package.json
git diff

# commit new version
echo "commit new snapshot version?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) git commit -m "$NEW_SNAPSHOT_VERSION";
              git push;
              break
          ;;
        No ) echo "you can rollback this change with 'git checkout -- package.json package-lock.json'";
             exit
         ;;
    esac
done

echo "continue with script"

# test if release branch exists

git rev-parse --verify $RELEASE_BRANCH 2>&1 /dev/null
if [ $? -eq 0 ]; then
    echo "branch exists, continuing will reset it"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) git checkout -B $RELEASE_BRANCH HEAD~1;
                  break
              ;;
            No ) echo "exiting";
                 echo "If you decide to go ahead and manually proceed, run this command:";
                 echo "git checkout -B $RELEASE_BRANCH HEAD~1";
                 exit
             ;;
        esac
    done
fi

npm version $RELEASE_VERSION
git push --set-upstream origin $RELEASE_BRANCH
git push --tags
