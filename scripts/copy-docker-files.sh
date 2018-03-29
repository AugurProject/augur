# copy files so augur.js is consistant with docker image passed as $1
docker run --rm --entrypoint cat $1  /augur.js/src/contracts/addresses.json > ./src/contracts/addresses.json
docker run --rm --entrypoint cat $1 /augur.js/src/contracts/upload-block-numbers.json > ./src/contracts/upload-block-numbers.json
