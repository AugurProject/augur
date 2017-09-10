"use strict";

var async = require("async");
var assign = require("lodash.assign");
var api = require("../api");
var getLoggedMarketInfo = require("./get-logged-market-info");
var parseBatchMarketInfo = require("../parsers/batch-market-info");

// { marketIDs }
function batchGetMarketInfo(p, callback) {
  api().MarketFetcher.batchGetMarketInfo(p, function (err, marketInfoArray) {
    if (err) return callback(err);
    var batchMarketInfo = parseBatchMarketInfo(marketInfoArray, p.marketIDs.length);
    async.eachSeries(p.marketIDs, function (marketID, nextMarketID) {
      var marketInfo = batchMarketInfo[marketID];
      if (!marketInfo) return callback({ error: "market info not found for " + marketID });
      getLoggedMarketInfo(assign({ creationBlock: marketInfo.creationBlock }, p), function (err, loggedMarketInfo) {
        if (err) return nextMarketID(err);
        batchMarketInfo[marketID] = assign(marketInfo, loggedMarketInfo);
        nextMarketID();
      });
    }, function (err) {
      if (err) return callback(err);
      callback(null, batchMarketInfo);
    });
  });
}

module.exports = batchGetMarketInfo;
