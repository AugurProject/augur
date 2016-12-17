#!/bin/bash
# update script (for local.augur.net)

git stash
git pull origin master
yarn
yarn build
sudo service augur restart
