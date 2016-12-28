#!/bin/bash
# update script (for local.augur.net)

git stash
git fetch --all
git reset --hard origin/master
yarn
yarn build
sudo service augur restart
