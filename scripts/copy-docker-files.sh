# copy files so augur.js is consistant with docker image passed as $1
IMAGE=$1
TEMP1="./temp.file"
ADD_TEMP2="./temp2.file"
BLOCK_TEMP2=".temp3.file"
ADDRESSES="./src/contracts/addresses.json"
BLOCKS="./src/contracts/upload-block-numbers.json"

echo "processing $IMAGE $ADDRESSES"
docker run --rm --entrypoint cat $IMAGE /augur.js/src/contracts/addresses.json > $TEMP1
node ./scripts/merge-json-files -p $ADDRESSES -s $TEMP1 -o $ADD_TEMP2
ADD_RESULT_CODE=$?

echo "processing $IMAGE $BLOCKS"
docker run --rm --entrypoint cat $IMAGE /augur.js/src/contracts/upload-block-numbers.json > $TEMP1
node ./scripts/merge-json-files -p $BLOCKS -s $TEMP1 -o $BLOCK_TEMP2
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

cat $ADD_TEMP2 > $ADDRESSES
cat $BLOCK_TEMP2 > $BLOCKS
rm -rf $TEMP1 $ADD_TEMP2 $BLOCK_TEMP2
