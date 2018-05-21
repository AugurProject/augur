#!/usr/bin/env bash

if [ $# -eq 0 ]
  then
    echo "Please supply a valid market ID, starting timestamp.";
    echo "Timestamp puts market in designated reporting state.";
    exit 1;
fi

MARKET_ID=$1
START_TIME=$2
OUTCOME=1
LONG_REST=6
USER_KEY_1="48c5da6dff330a9829d843ea90c2629e8134635a294c7e62ad4466eb2ae03712"
USER_KEY_2="8a4edfe30b4cdc9064b2e72d28bce9a650c24c6193de5058c96c296bc22d25d1"
USER_KEY_3="a08bd4f8e835ba11f5236595f7162b894923422ee6e4ba53b6259699ecd02fa5"
USER_KEY_4="ae95b6c42193f3f736ff91e19d19f1cb040672fe9144167c2e29ada17dc95b95"
USER_KEY_5="d4cf6736518eaff819676c7822842d239f1b4e182dbfc0e40d735b8c20ab4ba9"
USER_KEY_6="705d7d3f7a0e35df37e80e07c44ccd6b8757c2b44d50cb2f33bc493cc07f65e7"
USER_KEY_7="cfa5622e09afac03fb5dfa5cb54e52c9d37e06a5b07d5598850b62304639b815"

# Data in form of:
# open	high	low	close	volume
# This data is a normalized version of the microsoft stock daily time series
# 0x32d4d03600cf8432fda9a22c548b1f8b6ac92728
npx flash set-timestamp -t $START_TIME
sleep 4
npx flash designate-report -m $MARKET_ID -o 0
sleep 4
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_1 npx flash dispute-contribute -m $MARKET_ID -o 1 -n
sleep 4
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_2 npx flash dispute-contribute -m $MARKET_ID -o 1 -i -n
sleep 4
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_3 npx flash dispute-contribute -m $MARKET_ID -o 0 -n
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_4 npx flash dispute-contribute -m $MARKET_ID -o 1 -n
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_5 npx flash dispute-contribute -m $MARKET_ID -o 1 -i -n
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_6 npx flash dispute-contribute -m $MARKET_ID -o 0 -n
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_7 npx flash dispute-contribute -m $MARKET_ID -o 1 -n
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_1 npx flash dispute-contribute -m $MARKET_ID -o 1 -i -n
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_2 npx flash dispute-contribute -m $MARKET_ID -o 0 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 3
ETHEREUM_PRIVATE_KEY=$USER_KEY_3 npx flash dispute-contribute -m $MARKET_ID -o 1 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 3
ETHEREUM_PRIVATE_KEY=$USER_KEY_4 npx flash dispute-contribute -m $MARKET_ID -o 1 -i -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 3
ETHEREUM_PRIVATE_KEY=$USER_KEY_5 npx flash dispute-contribute -m $MARKET_ID -o 0 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_6 npx flash dispute-contribute -m $MARKET_ID -o 1 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_7 npx flash dispute-contribute -m $MARKET_ID -o 1 -i -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 3
ETHEREUM_PRIVATE_KEY=$USER_KEY_5 npx flash dispute-contribute -m $MARKET_ID -o 0 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_6 npx flash dispute-contribute -m $MARKET_ID -o 1 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_7 npx flash dispute-contribute -m $MARKET_ID -o 1 -i -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 3
ETHEREUM_PRIVATE_KEY=$USER_KEY_5 npx flash dispute-contribute -m $MARKET_ID -o 0 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_6 npx flash dispute-contribute -m $MARKET_ID -o 1 -n -a 1000000
sleep $LONG_REST
npx flash push-timestamp -c 1 -w
sleep 4
ETHEREUM_PRIVATE_KEY=$USER_KEY_7 npx flash dispute-contribute -m $MARKET_ID -o 1 -i -n -a 1000000
sleep $LONG_REST
