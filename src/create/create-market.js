"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var calculateRequiredMarketValue = require("../create/calculate-required-market-value");
var calculateTradingFees = require("../trading/fees/calculate-trading-fees");
var encodeTagArray = require("../format/tag/encode-tag-array");
var isObject = require("../utils/is-object");

// { branch, takerFee, event, tags, makerFee, extraInfo, onSent, onSuccess, onFailed }
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
