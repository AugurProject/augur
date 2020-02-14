#!/usr/bin/env bash
set -Eeuxo pipefail
# copy files so augur.js is consistant with docker image passed as $1
IMAGE=$1
TEMP1="./temp.file"
ADD_TEMP2="./temp2.file"
ENVIRONMENTS_CONFIG="../augur-artifacts/src/local-environments.json"

docker pull $IMAGE

echo "processing $IMAGE $ENVIRONMENTS_CONFIG"
docker run --rm --entrypoint cat $IMAGE /augur/packages/augur-artifacts/src/local-environments.json > $TEMP1
if [[ -f $ENVIRONMENTS_CONFIG ]]; then
  node scripts/merge-json-files -p $ENVIRONMENTS_CONFIG -s $TEMP1 -o $ADD_TEMP2
  cat $ADD_TEMP2 > $ENVIRONMENTS_CONFIG
else
  mv $TEMP1 $ENVIRONMENTS_CONFIG
fi
ADD_RESULT_CODE=$?

if [ $ADD_RESULT_CODE -eq 1 ]; then
 echo "ERROR occurred with $IMAGE updating $ENVIRONMENTS_CONFIG file"
 echo "ERROR make sure $IMAGE was pulled, use yarn docker:pull"
 rm -rf $TEMP1 $ADD_TEMP2
 exit
fi

rm -rf $TEMP1 $ADD_TEMP2
