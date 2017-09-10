"use strict";

var api = require("../api");
var parseBatchMarketInfo = require("../parsers/batch-market-info");

// { marketIDs }
function getMarketsInfo(p, callback) {
  api().MarketFetcher.batchGetMarketInfo(p, function (err, marketInfoArray) {
    if (err) return callback(err);
    callback(null, parseBatchMarketInfo(marketInfoArray, p.marketIDs.length));
  });
}

module.exports = getMarketsInfo;
