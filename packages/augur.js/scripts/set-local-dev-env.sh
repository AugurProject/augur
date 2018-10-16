#!/bin/bash

# All of these keys are optional, and have the defaults listed here
export USE_NORMAL_TIME="false"                # need to beable to change time manually
export ETHEREUM_HOST="localhost"              # where the ethereum node is running
export ETHEREUM_GAS_PRICE_IN_NANOETH="1"
export ETHEREUM_HTTP=http://127.0.0.1:8545    # http endpoint scripts are going to use
export ETHEREUM_WS=http://127.0.0.1:8546

# default user wallet to use for scripts (0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb)
export ETHEREUM_PRIVATE_KEY="fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a"
