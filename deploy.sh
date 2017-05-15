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
ssh jack@45.33.62.72 -t "cd /home/jack/augur && /home/jack/augur/update-local.sh && cp /home/jack/augur/src/env-9000.json /home/jack/augur/build/config/env.json && sudo service augur restart"
git push heroku master
ssh augur@45.33.59.27 -t "cd /home/augur/augur; /home/augur/augur/update-local.sh"
