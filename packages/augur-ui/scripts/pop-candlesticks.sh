#!/usr/bin/env bash

if [ $# -eq 0 ]
  then
    echo "Please supply a valid market ID and trading outcomes. default outcome is 2";
    exit 1;
fi


MARKET_ID=$1;
OUTCOME=$2;
PUSH_TIME=$3;

if [ "$OUTCOME" = "" ] ; then
  echo "set push time"
  OUTCOME=2;
fi

if [ "$PUSH_TIME" = "" ] ; then
  echo "set push time"
  PUSH_TIME=true;
fi

echo "Number of outcomes: $NUM_OF_OUTCOMES";

# Data in form of:
# open	high	low	close	volume
# This data is a normalized version of the microsoft stock daily time series
curl https://gist.githubusercontent.com/justinbarry/bf6cd9afcd8778027e211105562b89d7/raw/cae40936cc1930e310411ec27d957769b93d8068/data.tsv | \
while IFS=$'\t' read -r -a dataArray
do
  for ((i = 0; i < ${#dataArray[@]}; ++i)); do
    if ! ((i % 2)); then
      TRANS_ONE_TYPE='sell'
      TRANS_TWO_TYPE='buy'
    else
      TRANS_ONE_TYPE='buy'
      TRANS_TWO_TYPE='sell'
    fi

    echo "Sell trade $i";
    yarn flash run create-market-order -u "0xbd355a7e5a7adb23b51f54027e624bfe0e238df6" -m $MARKET_ID -o $OUTCOME -t $TRANS_ONE_TYPE -a "$(jot  -p 4 -r 1 0 1)" -p "${dataArray[$i]}"

    echo "Filling trade $i";
    yarn flash run fill-market-orders -u "0xe4ec477bc4abd2b18225bb8cba14bf57867f082b" -m $MARKET_ID -o $OUTCOME -t $TRANS_TWO_TYPE -a "$(jot  -p 4 -r 1 0 1)" -p "${dataArray[$i]}"

    if [ "$PUSH_TIME" = true ] ; then
      yarn flash run push-timestamp -c 1h;
    fi

    sleep 10
  done

  if [ "$PUSH_TIME" = true ] ; then
    echo "Push time";
    yarn flash run push-timestamp -c 2h;
  fi
  sleep 10
done
