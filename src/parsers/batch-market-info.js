"use strict";

var abi = require("augur-abi");
var parseMarketInfo = require("./market-info");

module.exports = function (marketsArray, numMarkets) {
  var len, shift, rawInfo, info, marketID, marketsInfo, totalLen, i;
  if (!Array.isArray(marketsArray) || !marketsArray.length) {
    return marketsArray;
  }
  marketsInfo = {};
  totalLen = 0;
  for (i = 0; i < numMarkets; ++i) {
    len = parseInt(marketsArray[totalLen], 16);
    shift = totalLen + 1;
    rawInfo = marketsArray.slice(shift, shift + len - 1);
    marketID = abi.format_int256(marketsArray[shift]);
    info = parseMarketInfo(rawInfo);
    if (info && info.numOutcomes) marketsInfo[marketID] = info;
    totalLen += len;
  }
  return marketsInfo;
};
