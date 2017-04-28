"use strict";

var abi = require("augur-abi");
var rpc = require("../rpc-interface");
var decodeTag = require("../format/tag/decode-tag");
var unfixConsensusOutcome = require("../reporting/format/unfix-consensus-outcome");
var calculateMakerTakerFees = require("../trading/fees/calculate-maker-taker-fees");

var EVENTS_FIELDS = 9;
var OUTCOMES_FIELDS = 3;
var MINIMUM_MARKET_INFO_LENGTH = 14;

// marketInfo[0] = marketID
// marketInfo[1] = MARKETS.getMakerFees(marketID)
// marketInfo[2] = numOutcomes
// marketInfo[3] = MARKETS.getTradingPeriod(marketID)
// marketInfo[4] = MARKETS.getTradingFee(marketID)
// marketInfo[5] = MARKETS.getBranchID(marketID)
// marketInfo[6] = MARKETS.getCumScale(marketID)
// marketInfo[7] = MARKETS.getCreationTime(marketID)
// marketInfo[8] = MARKETS.getCreationBlock(marketID)
// marketInfo[9] = MARKETS.getVolume(marketID)
// marketInfo[10] = INFO.getCreationFee(marketID)
// marketInfo[11] = INFO.getCreator(marketID)
// tags = MARKETS.returnTags(marketID, outitems=3)
// marketInfo[12] = tags[0]
// marketInfo[13] = tags[1]
// marketInfo[14] = tags[2]
module.exports = function (rawInfo) {
  var numOutcomes, info, index, fees, topic, fxpConsensusOutcome, unfixed, i, descriptionLength, extraInfoLength, resolutionSourceLength;
  if (rawInfo == null || rawInfo.length < MINIMUM_MARKET_INFO_LENGTH) return null;
  if (!rawInfo[0] || !rawInfo[2] || !rawInfo[4] || !rawInfo[7] || !rawInfo[8]) return null;
  numOutcomes = parseInt(rawInfo[2], 16);
  if (!numOutcomes || isNaN(numOutcomes)) return null;
  info = {};
  index = MINIMUM_MARKET_INFO_LENGTH + 1;
  fees = calculateMakerTakerFees(rawInfo[4], rawInfo[1]);
  topic = decodeTag(rawInfo[12]);
  info = {
    id: abi.format_int256(rawInfo[0]),
    network: rpc.getNetworkID(),
    makerFee: fees.maker,
    takerFee: fees.taker,
    tradingFee: fees.trading,
    numOutcomes: numOutcomes,
    tradingPeriod: parseInt(rawInfo[3], 16),
    branchID: rawInfo[5],
    cumulativeScale: abi.unfix(rawInfo[6], "string"),
    creationTime: parseInt(rawInfo[7], 16),
    creationBlock: parseInt(rawInfo[8], 16),
    volume: abi.unfix(rawInfo[9], "string"),
    creationFee: abi.unfix(rawInfo[10], "string"),
    author: abi.format_address(rawInfo[11]),
    topic: topic,
    tags: [topic, decodeTag(rawInfo[13]), decodeTag(rawInfo[14])],
    minValue: abi.unfix_signed(rawInfo[index + 3], "string"),
    maxValue: abi.unfix_signed(rawInfo[index + 4], "string"),
    endDate: parseInt(rawInfo[index + 1], 16),
    eventID: abi.format_int256(rawInfo[index]),
    eventBond: abi.unfix_signed(rawInfo[index + 6], "string")
  };

  // type: binary, categorical, or scalar
  if (info.numOutcomes > 2) {
    info.type = "categorical";
  } else if (info.minValue === "1" && info.maxValue === "2") {
    info.type = "binary";
  } else {
    info.type = "scalar";
  }
  if (parseInt(rawInfo[index + 2], 16) !== 0) {
    fxpConsensusOutcome = rawInfo[index + 2];
    unfixed = unfixConsensusOutcome(fxpConsensusOutcome, info.minValue, info.maxValue, info.type);
    info.consensus = {
      outcomeID: unfixed.outcomeID,
      isIndeterminate: unfixed.isIndeterminate,
      isUnethical: !abi.unfix_signed(rawInfo[index + 7], "number")
    };
    if (parseInt(rawInfo[index + 8], 16) !== 0) {
      info.consensus.proportionCorrect = abi.unfix(rawInfo[index + 8], "string");
    }
  } else {
    info.consensus = null;
  }
  index += EVENTS_FIELDS;

  // organize outcome info
  info.outcomes = new Array(info.numOutcomes);
  for (i = 0; i < info.numOutcomes; ++i) {
    info.outcomes[i] = {
      id: i + 1,
      outstandingShares: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index], "string"),
      price: abi.unfix_signed(rawInfo[i*OUTCOMES_FIELDS + index + 1], "string"),
      sharesPurchased: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index + 2], "string")
    };
  }
  index += info.numOutcomes*OUTCOMES_FIELDS;

  // convert description byte array to unicode
  descriptionLength = parseInt(rawInfo[index], 16);
  ++index;
  if (descriptionLength) {
    info.description = abi.bytes_to_utf16(rawInfo.slice(index, index + descriptionLength));
    index += descriptionLength;
  }

  // convert resolution byte array to unicode
  resolutionSourceLength = parseInt(rawInfo[index], 16);
  ++index;
  if (resolutionSourceLength) {
    info.resolutionSource = abi.bytes_to_utf16(rawInfo.slice(index, index + resolutionSourceLength));
    index += resolutionSourceLength;
  }

  // convert extraInfo byte array to unicode
  extraInfoLength = parseInt(rawInfo[index], 16);
  if (extraInfoLength) {
    info.extraInfo = abi.bytes_to_utf16(rawInfo.slice(rawInfo.length - extraInfoLength));
  }
  return info;
};
