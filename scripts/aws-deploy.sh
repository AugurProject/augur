#!/bin/bash

set -x

pip install awscli

aws --region=us-east-1 ecs update-service  --service dev-augur-node --cluster dev-augur-net --force-new-deployment
