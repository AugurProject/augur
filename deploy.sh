#!/bin/bash
# Augur deployment for incredibly lazy people.
# (c) Jack Peterson (jack@tinybike.net)

git add build/*
git commit -am "${1}"
git push origin master
firebase deploy
$AUGUR_CORE/load_contracts/update_private_chain_augur.sh
ssh augur@45.33.59.27 -t "cd /home/augur/augur; /home/augur/augur/update-local.sh"
git push heroku master
