# copy files so augur.js is consistant with docker image
docker run --rm --entrypoint cat augurproject/dev-pop-geth:latest /augur.js/src/contracts/addresses.json > ./src/contracts/addresses.json
docker run --rm --entrypoint cat augurproject/dev-pop-geth:latest /augur.js/src/contracts/upload-block-numbers.json > ./src/contracts/upload-block-numbers.json
