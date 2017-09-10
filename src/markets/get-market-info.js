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
  api().MarketFetcher.getMarketInfo(p, function (err, marketInfoArray) {
    if (err) return callback(err);
    var marketInfo = parseMarketInfo(marketInfoArray);
    getLoggedMarketInfo({ market: p._market, creationBlock: marketInfo.creationBlock }, function (err, loggedMarketInfo) {
      if (err) return callback(err);
      callback(null, assign(marketInfo, loggedMarketInfo));
    });
  });
}

module.exports = getMarketInfo;
