"use strict";

var api = require("../api");
var parseBatchMarketInfo = require("../parsers/batch-market-info");

// { marketIDs }
function getMarketsInfo(p, callback) {
  api().MarketFetcher.batchGetMarketInfo(p, function (marketInfoArray) {
    if (!marketInfoArray) return callback({ error: "market info not found" });
    if (marketInfoArray.error) return callback(marketInfoArray);
    callback(parseBatchMarketInfo(marketInfoArray, p.marketIDs.length));
  });
}

module.exports = getMarketsInfo;
