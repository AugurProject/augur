"use strict";

var abi = require("augur-abi");
var unfixConsensusOutcome = require("../reporting/format/unfix-consensus-outcome");
var decodeTag = require("../format/tag/decode-tag");

module.exports = function (marketsInfoArray, branch) {
  if (!Array.isArray(marketsInfoArray) || !marketsInfoArray.length) return null;
  var numMarkets = parseInt(marketsInfoArray.shift(), 16);
  var marketsInfo = {};
  var totalLen = 0;
  for (var i = 0; i < numMarkets; ++i) {
    var len = parseInt(marketsInfoArray[totalLen], 16);
    var shift = totalLen + 1;
    var marketID = abi.format_int256(marketsInfoArray[shift]);
    var minPrice = abi.unfix_signed(marketsInfoArray[shift + 11], "string");
    var maxPrice = abi.unfix_signed(marketsInfoArray[shift + 12], "string");
    var numOutcomes = parseInt(marketsInfoArray[shift + 13], 16);
    var consensusOutcomeID = abi.hex(marketsInfoArray[shift + 14], true);
    var consensus;
    if (!abi.unfix(consensusOutcomeID, "number")) {
      consensus = null;
    } else {
      var unfixed = unfixConsensusOutcome(consensusOutcomeID, minPrice, maxPrice);
      consensus = {
        outcomeID: unfixed.outcomeID,
        isIndeterminate: unfixed.isIndeterminate
      };
    }
    var topic = decodeTag(marketsInfoArray[shift + 5]);
    marketsInfo[marketID] = {
      id: marketID,
      branchID: branch,
      volume: abi.unfix(marketsInfoArray[shift + 4], "string"),
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
