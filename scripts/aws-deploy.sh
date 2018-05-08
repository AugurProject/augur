#!/bin/bash

set -x

# ssl requirements for aws
sudo apt-get install python-service-identity pyasn1

sudo pip install awscli

aws --region=us-east-1 ecs update-service  --service dev-augur-node --cluster dev-augur-net --force-new-deployment
