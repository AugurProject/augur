"use strict";

var api = require("../api");

// account is optional, if provided will return sharesPurchased
// { marketID, account }
function getMarketInfo(p, callback) {
  return api().MarketInfo.getMarketInfo({
    marketID: p.marketID,
    account: p.account || 0
  }, callback);
}

module.exports = getMarketInfo;
