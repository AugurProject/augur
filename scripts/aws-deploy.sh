#!/bin/bash

set -x

# ssl requirements for aws
sudo apt-get install libssl-dev

# try and get rid of SNI warnings
sudo pip install requests[security]

# we need aws cli tools to deploy
sudo pip install awscli

aws --region=us-east-1 ecs update-service  --service dev-augur-node --cluster dev-augur-net --force-new-deployment
