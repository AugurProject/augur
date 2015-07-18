#!/bin/bash

trap "exit" INT

jshint src

mocha test/test_fixedpoint.js $1
mocha test/test_encoder.js $1
mocha test/test_ethrpc.js $1
mocha test/test_invoke.js $1
# mocha test/test_expiring.js $1
mocha test/test_batch.js $1
mocha test/test_connect.js $1
mocha test/test_contracts.js $1
# mocha test/test_createEvent.js $1
mocha test/test_createMarket.js $1
mocha test/test_branches.js $1
mocha test/test_info.js $1
mocha test/test_markets.js $1
mocha test/test_events.js $1
mocha test/test_reporting.js $1
# mocha test/test_ballot.js $1
mocha test/test_payments.js $1
mocha test/test_comments.js $1
# mocha test/test_priceLog.js $1
mocha test/test_webclient.js $1
