#!/bin/bash
# Augur deployment for incredibly lazy people.
# (c) Jack Peterson (jack@tinybike.net)

yarn
yarn build
git add build/*
git commit -S -am "${1}"
yarn lint
yarn test
git push origin master
firebase deploy
$AUGUR_CORE/load_contracts/update_private_chain_augur.sh
ssh augur@45.33.59.27 -t "cd /home/augur/augur; /home/augur/augur/update-local.sh"
git push heroku master
