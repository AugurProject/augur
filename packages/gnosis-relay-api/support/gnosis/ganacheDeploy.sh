#!/bin/bash

export ETHEREUM_PRIVATE_KEY=0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d

yarn workspace @augurproject/tools flash deploy --write-artifacts
yarn workspace @augurproject/tools build
yarn workspace @augurproject/tools flash faucet --amount 10000000000000000000
yarn workspace @augurproject/tools flash rep-faucet --amount 100000
yarn workspace @augurproject/tools flash create-canned-markets
