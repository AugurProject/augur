#!/bin/bash

trap "exit" INT

jshint src

mocha test/fixedpoint.js $1
mocha test/encoder.js $1
mocha test/ethrpc.js $1
mocha test/invoke.js $1
mocha test/batch.js $1
mocha test/connect.js $1
mocha test/contracts.js $1
mocha test/faucets.js $1
mocha test/createMarket.js $1
mocha test/branches.js $1
mocha test/info.js $1
mocha test/markets.js $1
mocha test/events.js $1
mocha test/reporting.js $1
mocha test/payments.js $1
# mocha test/comments.js $1
# mocha test/priceLog.js $1
mocha test/web.js $1
mocha test/multicast.js $1

# mocha test/expiring.js $1
mocha test/createEvent.js $1
mocha test/buyAndSellShares.js $1
# mocha test/ballot.js $1
# mocha test/makeReports.js $1
# mocha test/checkQuorum.js $1
# mocha test/closeMarket.js $1
# mocha test/dispatch.js $1
# mocha test/interpolate.js $1
# mocha test/resolve.js $1
# mocha test/score.js $1
