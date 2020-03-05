#!/usr/bin/env bash
set -Eeuxo pipefail
# copy files so augur is consistant with docker image passed as $1
IMAGE=$1
TEMP1="./temp.file"
ADD_TEMP2="./temp2.file"
CONFIG="../augur-artifacts/src/environments/local.json"

docker pull $IMAGE

echo "processing $IMAGE $CONFIG"
docker run --rm --entrypoint cat $IMAGE /augur/packages/augur-artifacts/src/environments/local.json > $TEMP1
mv $TEMP1 $CONFIG
ADD_RESULT_CODE=$?

if [ $ADD_RESULT_CODE -eq 1 ]; then
 echo "ERROR occurred with $IMAGE updating $CONFIG file"
 echo "ERROR make sure $IMAGE was pulled, use yarn docker:pull"
 rm -rf $TEMP1
 exit
fi

rm -rf $TEMP1
