"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var calculateRequiredMarketValue = require("../create/calculate-required-market-value");
var calculateTradingFees = require("../trading/fees/calculate-trading-fees");
var encodeTagArray = require("../format/tag/encode-tag-array");

// new: { branch, endTime, numOutcomes, feePerEthInWei, denominationToken, automatedReporterAddress, topic, minValue, maxValue }
// # TODO: we need to update this signature (and all of the places that call it) to allow the creator (UI) to pass in a number of other things which will all be logged here
// # TODO: log short description
// # TODO: log long description
// # TODO: log min display price
// # TODO: log max display price
// # TODO: log tags (up to 0-2)
// # TODO: log outcome labels (same number as numOutcomes)
// # TODO: log type (scalar, binary, categorical)

// createMarket(branch, endTime, numOutcomes, feePerEthInAttoeth, denominationToken, automatedReporterAddress, topic, minDisplayPrice, maxDisplayPrice, type, shortDescription: str, longDescription: str, tags: arr, outcomeLabels: arr)

// old: { branch, takerFee, event, tags, makerFee, extraInfo, onSent, onSuccess, onFailed }
function createMarket(p) {
  var formattedTags = encodeTagArray(p.tags);
  var fees = calculateTradingFees(p.makerFee, p.takerFee);
  api().CreateMarket.createMarket(assign({}, p, {
    tradingFee: abi.fix(fees.tradingFee, "hex"),
    tag1: formattedTags[0],
    tag2: formattedTags[1],
    tag3: formattedTags[2],
    makerFees: abi.fix(fees.makerProportionOfFee, "hex"),
    extraInfo: p.extraInfo || "",
    tx: { value: calculateRequiredMarketValue(rpcInterface.getGasPrice()) }
  }));
}

module.exports = createMarket;
