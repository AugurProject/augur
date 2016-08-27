#!/bin/bash
# update script (for local.augur.net)

sudo service augur stop
git pull origin master
npm install
npm run build
mv build/index-2.0.0.html build/index.html
sudo service augur start
