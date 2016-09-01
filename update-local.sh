#!/bin/bash
# update script (for local.augur.net)

sudo service augur stop
git pull origin master
npm install
npm run build:dev
sudo service augur start
