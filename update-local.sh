#!/bin/bash
# update script (for local.augur.net)

sudo service augur stop
git pull origin develop
npm install
grunt
grunt browserify:debug
sudo service augur start
