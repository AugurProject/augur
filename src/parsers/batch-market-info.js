"use strict";

var abi = require("augur-abi");
var parseMarketInfo = require("./market-info");

module.exports = function (batchMarketInfoArray, numMarkets) {
  if (!Array.isArray(batchMarketInfoArray) || !batchMarketInfoArray.length) {
    return batchMarketInfoArray;
  }
  var batchMarketInfo = {};
  var totalLen = 0;
  for (var i = 0; i < numMarkets; ++i) {
    var len = parseInt(batchMarketInfoArray[totalLen], 16);
    var shift = totalLen + 1;
    var marketInfoArray = batchMarketInfoArray.slice(shift, shift + len - 1);
    var marketID = abi.format_int256(batchMarketInfoArray[shift]);
    var marketInfo = parseMarketInfo(marketInfoArray);
    if (marketInfo && marketInfo.numOutcomes) batchMarketInfo[marketID] = marketInfo;
    totalLen += len;
  }
  return batchMarketInfo;
};
