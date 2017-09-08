"use strict";

var assign = require("lodash.assign");
var api = require("../api");
var getLoggedMarketInfo = require("./get-logged-market-info");
var parseMarketInfo = require("../parsers/market-info");

/**
 * @param {Object} p Parameters object.
 * @param {string} p._market Market contract address for which to lookup info, as a hexadecimal string.
 * @return {Object} Market info object, merges the outputs of parseMarketInfo and getLoggedMarketInfo.
 */
function getMarketInfo(p, callback) {
  api().MarketFetcher.getMarketInfo(p, function (marketInfoArray) {
    if (!marketInfoArray) return callback("market info not found");
    if (marketInfoArray.error) return callback(marketInfoArray);
    var marketInfo = parseMarketInfo(marketInfoArray);
    getLoggedMarketInfo({ market: p._market, creationBlock: marketInfo.creationBlock }, function (loggedMarketInfo) {
      callback(assign(marketInfo, loggedMarketInfo));
    });
  });
}

module.exports = getMarketInfo;
