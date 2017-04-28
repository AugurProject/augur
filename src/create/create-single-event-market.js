"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var calculateRequiredMarketValue = require("../create/calculate-required-market-value");
var calculateTradingFees = require("../trading/fees/calculate-trading-fees");
var encodeTagArray = require("../format/tag/encode-tag-array");

// { branch, description, expDate, minValue, maxValue, numOutcomes, resolution, takerFee, tags, makerFee, extraInfo, onSent, onSuccess, onFailed }
function createSingleEventMarket(p) {
  var formattedTags = encodeTagArray(p.tags);
  var fees = calculateTradingFees(p.makerFee, p.takerFee);
  if (p.description) p.description = p.description.trim();
  if (p.resolution) p.resolution = p.resolution.trim();
  api().CreateMarket.createSingleEventMarket(assign({}, p, {
    expDate: parseInt(p.expDate, 10),
    minValue: abi.fix(p.minValue, "hex"),
    maxValue: abi.fix(p.maxValue, "hex"),
    tradingFee: abi.fix(fees.tradingFee, "hex"),
    tag1: formattedTags[0],
    tag2: formattedTags[1],
    tag3: formattedTags[2],
    makerFees: abi.fix(fees.makerProportionOfFee, "hex"),
    extraInfo: p.extraInfo || "",
    tx: { value: calculateRequiredMarketValue(rpcInterface.getGasPrice()) }
  }));
}

module.exports = createSingleEventMarket;
