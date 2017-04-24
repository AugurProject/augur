"use strict";

var abi = require("augur-abi");
var calculateMakerTakerFees = require("../trading/fees/calculate-maker-taker-fees");
var unfixConsensusOutcome = require("../reporting/format/unfix-consensus-outcome");
var decodeTag = require("../format/tag/decode-tag");

module.exports = function (marketsArray, branch) {
  var len, shift, marketID, fees, minValue, maxValue, numOutcomes, type, unfixed, consensusOutcomeID, consensus, numMarkets, marketsInfo, totalLen, i, topic;
  if (!Array.isArray(marketsArray) || !marketsArray.length) {
    return null;
  }
  numMarkets = parseInt(marketsArray.shift(), 16);
  marketsInfo = {};
  totalLen = 0;
  for (i = 0; i < numMarkets; ++i) {
    len = parseInt(marketsArray[totalLen], 16);
    shift = totalLen + 1;
    marketID = abi.format_int256(marketsArray[shift]);
    fees = calculateMakerTakerFees(marketsArray[shift + 2], marketsArray[shift + 9]);
    minValue = abi.unfix_signed(marketsArray[shift + 11], "string");
    maxValue = abi.unfix_signed(marketsArray[shift + 12], "string");
    numOutcomes = parseInt(marketsArray[shift + 13], 16);
    if (numOutcomes > 2) {
      type = "categorical";
    } else if (minValue === "1" && maxValue === "2") {
      type = "binary";
    } else {
      type = "scalar";
    }
    consensusOutcomeID = abi.hex(marketsArray[shift + 14], true);
    if (!abi.unfix(consensusOutcomeID, "number")) {
      consensus = null;
    } else {
      unfixed = unfixConsensusOutcome(consensusOutcomeID, minValue, maxValue, type);
      consensus = {
        outcomeID: unfixed.outcomeID,
        isIndeterminate: unfixed.isIndeterminate
      };
    }
    topic = decodeTag(marketsArray[shift + 5]);
    marketsInfo[marketID] = {
      id: marketID,
      branchID: branch,
      tradingPeriod: parseInt(marketsArray[shift + 1], 16),
      tradingFee: fees.trading,
      makerFee: fees.maker,
      takerFee: fees.taker,
      creationTime: parseInt(marketsArray[shift + 3], 16),
      volume: abi.unfix(marketsArray[shift + 4], "string"),
      topic: topic,
      tags: [topic, decodeTag(marketsArray[shift + 6]), decodeTag(marketsArray[shift + 7])],
      endDate: parseInt(marketsArray[shift + 8], 16),
      eventID: abi.format_int256(marketsArray[shift + 10]),
      minValue: minValue,
      maxValue: maxValue,
      numOutcomes: numOutcomes,
      type: type,
      consensus: consensus,
      description: abi.bytes_to_utf16(marketsArray.slice(shift + 15, shift + len - 1))
    };
    totalLen += len;
  }
  return marketsInfo;
};
