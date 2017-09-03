"use strict";

var speedomatic = require("speedomatic");
var rpc = require("../rpc-interface");
var decodeTag = require("../format/tag/decode-tag");
var unfixConsensusOutcome = require("../reporting/format/unfix-consensus-outcome");

// marketInfo[0] = marketID
// marketInfo[2] = numOutcomes
// marketInfo[5] = MARKETS.getBranchID(marketID)
// marketInfo[8] = MARKETS.getCreationBlock(marketID)
// marketInfo[9] = MARKETS.getVolume(marketID)
// marketInfo[11] = INFO.getCreator(marketID)
module.exports = function (marketInfoArray) {
  if (marketInfoArray == null) return null;
  var numOutcomes = parseInt(marketInfoArray[2], 16);
  if (!numOutcomes || isNaN(numOutcomes)) return null;
  var marketInfo = {};
  var index = 11;
  var topic = decodeTag(marketInfoArray[12]);
  marketInfo = {
    id: speedomatic.formatInt256(marketInfoArray[0]),
    network: rpc.getNetworkID(),
    numOutcomes: numOutcomes,
    branchID: marketInfoArray[5],
    creationBlock: parseInt(marketInfoArray[8], 16),
    volume: speedomatic.unfix(marketInfoArray[9], "string"),
    author: speedomatic.formatEthereumAddress(marketInfoArray[11]),
    topic: topic,
    minPrice: speedomatic.unfixSigned(marketInfoArray[index + 3], "string"),
    maxPrice: speedomatic.unfixSigned(marketInfoArray[index + 4], "string")
  };
  if (parseInt(marketInfoArray[index + 2], 16) !== 0) {
    var fxpConsensusOutcome = marketInfoArray[index + 2];
    var unfixed = unfixConsensusOutcome(fxpConsensusOutcome, marketInfo.minPrice, marketInfo.maxPrice, marketInfo.type);
    marketInfo.consensus = {
      outcomeID: unfixed.outcomeID,
      isIndeterminate: unfixed.isIndeterminate
    };
  } else {
    marketInfo.consensus = null;
  }
  return marketInfo;
};
