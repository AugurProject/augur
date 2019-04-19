#!/usr/bin/env bash

if [ $# -eq 0 ]
  then
    echo "Please supply a valid market ID.";
    exit 1;
fi

MARKET_ID=$1;

MARKET_TYPE=$(npx flash market-info -m $MARKET_ID | grep marketType | cut -d " " -f2);
NUM_OF_OUTCOMES=1;
if [ "$MARKET_TYPE" = "categorical" ]; then
NUM_OF_OUTCOMES=$(npx flash market-info -m $MARKET_ID | grep numOutcomes | cut -d " " -f2);
fi

echo "Number of outcomes: $NUM_OF_OUTCOMES";

# Data in form of:
# open	high	low	close	volume
# This data is a normalized version of the microsoft stock daily time series
curl https://gist.githubusercontent.com/justinbarry/bf6cd9afcd8778027e211105562b89d7/raw/cae40936cc1930e310411ec27d957769b93d8068/data.tsv | \
while IFS=$'\t' read -r -a dataArray
do
  for ((i = 0; i < ${#dataArray[@]}; ++i)); do
    if [ "$MARKET_TYPE" = "categorical" ]; then
      OUTCOME=$((RANDOM % $NUM_OF_OUTCOMES));
    else
      OUTCOME=1
    fi
    if ! ((i % 2)); then
      TRANS_ONE_TYPE='sell'
      TRANS_TWO_TYPE='buy'
    else
      TRANS_ONE_TYPE='buy'
      TRANS_TWO_TYPE='sell'
    fi

    echo "Sell trade $i";
    ETHEREUM_PRIVATE_KEY=fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a npx flash create-market-order --marketId $MARKET_ID --outcome $OUTCOME --orderType $TRANS_ONE_TYPE --amount "$(jot  -p 4 -r 1 0 1)" --price "${dataArray[$i]}"

    echo "Filling trade $i";
    ETHEREUM_PRIVATE_KEY=48c5da6dff330a9829d843ea90c2629e8134635a294c7e62ad4466eb2ae03712 npx flash fill-market-orders -m $MARKET_ID -o $OUTCOME -t $TRANS_TWO_TYPE;

    npx flash push-timestamp -s -c 600;
    sleep 15
  done

  echo "Push time";
  npx flash push-timestamp -s -c 3600;
  sleep 15
done
