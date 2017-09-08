"use strict";

var speedomatic = require("speedomatic");
var decodeTag = require("../format/tag/decode-tag");

module.exports = function (marketsInfoArray, branch) {
  if (!Array.isArray(marketsInfoArray) || !marketsInfoArray.length) return null;
  var numMarkets = parseInt(marketsInfoArray.shift(), 16);
  var marketsInfo = {};
  var totalLen = 0;
  for (var i = 0; i < numMarkets; ++i) {
    var len = parseInt(marketsInfoArray[totalLen], 16);
    var shift = totalLen + 1;
    var marketID = speedomatic.formatInt256(marketsInfoArray[shift]);
    var minPrice = speedomatic.unfixSigned(marketsInfoArray[shift + 11], "string");
    var maxPrice = speedomatic.unfixSigned(marketsInfoArray[shift + 12], "string");
    var numOutcomes = parseInt(marketsInfoArray[shift + 13], 16);
    var consensusOutcomeID = speedomatic.hex(marketsInfoArray[shift + 14], true);
    var consensus;
    if (!speedomatic.unfix(consensusOutcomeID, "number")) {
      consensus = null;
    } else {
      consensus = {
        outcomeID: consensusOutcomeID,
        isIndeterminate: null // FIXME
      };
    }
    var topic = decodeTag(marketsInfoArray[shift + 5]);
    marketsInfo[marketID] = {
      id: marketID,
      branchID: branch,
      volume: speedomatic.unfix(marketsInfoArray[shift + 4], "string"),
      topic: topic,
      minPrice: minPrice,
      maxPrice: maxPrice,
      numOutcomes: numOutcomes,
      consensus: consensus
    };
    totalLen += len;
  }
  return marketsInfo;
};
