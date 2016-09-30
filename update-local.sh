#!/bin/bash
# update script (for local.augur.net)

git pull origin master
npm install
npm run build:dev
sudo service augur restart
