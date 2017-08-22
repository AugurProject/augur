"use strict";

var assign = require("lodash.assign");
var api = require("../api");
var getLoggedMarketInfo = require("./get-logged-market-info");
var parseMarketInfo = require("../parsers/market-info");

// { marketID }
function getMarketInfo(p, callback) {
  api().MarketFetcher.getMarketInfo(p, function (marketInfoArray) {
    if (!marketInfoArray) return callback("market info not found");
    if (marketInfoArray.error) return callback(marketInfoArray);
    var marketInfo = parseMarketInfo(marketInfoArray);
    getLoggedMarketInfo(assign({}, p, { creationBlock: marketInfo.creationBlock }), function (loggedMarketInfo) {
      callback(assign(marketInfo, loggedMarketInfo));
    });
  });
}

module.exports = getMarketInfo;
