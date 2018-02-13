#!/bin/bash

set -ex

docker run --rm --net host -it ethereum/client-go attach rpc:http://127.0.0.1:8545
