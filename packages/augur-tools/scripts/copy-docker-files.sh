#!/usr/bin/env bash
set -Eeuxo pipefail
# copy files so augur.js is consistant with docker image passed as $1
IMAGE=$1
TEMP1="./temp.file"
ADD_TEMP2="./temp2.file"
BLOCK_TEMP2=".temp3.file"
ADDRESSES="../augur-artifacts/src/local-addresses.json"
BLOCKS="../augur-artifacts/src/local-upload-block-numbers.json"

docker pull $IMAGE

echo "processing $IMAGE $ADDRESSES"
docker run --rm --entrypoint cat $IMAGE /augur/packages/augur-artifacts/src/local-addresses.json > $TEMP1
if [[ -f $ADDRESSES ]]; then
  node scripts/merge-json-files -p $ADDRESSES -s $TEMP1 -o $ADD_TEMP2
  cat $ADD_TEMP2 > $ADDRESSES
else
  mv $TEMP1 $ADDRESSES
fi
ADD_RESULT_CODE=$?

echo "processing $IMAGE $BLOCKS"
docker run --rm --entrypoint cat $IMAGE /augur/packages/augur-artifacts/src/local-upload-block-numbers.json > $TEMP1
if [[ -f $BLOCKS ]]; then
  node scripts/merge-json-files -p $BLOCKS -s $TEMP1 -o $BLOCK_TEMP2
  cat $BLOCK_TEMP2 > $BLOCKS
else
  mv $TEMP1 $BLOCKS
fi
ADD_BLOCK_CODE=$?

if [ $ADD_RESULT_CODE -eq 1 ]; then
 echo "ERROR occurred with $IMAGE updating $ADDRESSES file"
 echo "ERROR make sure $IMAGE was pulled, use npm run docker:pull"
 rm -rf $TEMP1 $ADD_TEMP2 $BLOCK_TEMP2
 exit
fi

if [ $ADD_BLOCK_CODE -eq 1 ]; then
 echo "ERROR occurred with $IMAGE updating $BLOCKS file"
 echo "ERROR make sure $IMAGE was pulled, use npm run docker:pull"
 rm -rf $TEMP1 $ADD_TEMP2 $BLOCK_TEMP2
 exit
fi

rm -rf $TEMP1 $ADD_TEMP2 $BLOCK_TEMP2
