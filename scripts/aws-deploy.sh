#!/bin/bash

set -x

# ssl requirements for aws
apt install python-service-identity pyasn1

pip install awscli

aws --region=us-east-1 ecs update-service  --service dev-augur-node --cluster dev-augur-net --force-new-deployment
