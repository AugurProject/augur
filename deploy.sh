#!/bin/bash

cp src/sitemap.xml build/sitemap.xml
git commit -am "${1}"
git push origin master
firebase deploy
$AUGUR_CORE/load_contracts/update_private_chain_augur.sh
ssh augur@45.33.59.27 -t "cd /home/augur/augur; /home/augur/augur/update-local.sh"
git push heroku master
