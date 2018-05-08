#!/bin/bash

set -x

# ssl requirements for aws
pip install pyopenssl ndg-httpsclient pyasn1
pip install awscli

aws --region=us-east-1 ecs update-service  --service dev-augur-node --cluster dev-augur-net --force-new-deployment
