"use strict";

var api = require("../api");

// { marketIDs, account }
function batchGetMarketInfo(p, callback) {
  return api().MarketInfo.batchGetMarketInfo({
    marketIDs: p.marketIDs,
    account: p.account || 0
  }, callback, { extraArgument: p.marketIDs.length });
}

module.exports = batchGetMarketInfo;
