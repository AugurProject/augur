"use strict";

var abi = require("augur-abi");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var calculateRequiredMarketValue = require("../create/calculate-required-market-value");
var calculateTradingFees = require("../trading/fees/calculate-trading-fees");
var encodeTagArray = require("../format/tag/encode-tag-array");
var isObject = require("../utils/is-object");

function createMarket(branch, takerFee, event, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
  var formattedTags, fees;
  if (isObject(branch)) {
    takerFee = branch.takerFee;
    event = branch.event;
    tags = branch.tags;
    makerFee = branch.makerFee;
    extraInfo = branch.extraInfo;
    onSent = branch.onSent;
    onSuccess = branch.onSuccess;
    onFailed = branch.onFailed;
    branch = branch.branch;
  }
  formattedTags = encodeTagArray(tags);
  fees = calculateTradingFees(makerFee, takerFee);
  api().CreateMarket.createMarket({
    branch: branch,
    tradingFee: abi.fix(fees.tradingFee, "hex"),
    event: event,
    tag1: formattedTags[0],
    tag2: formattedTags[1],
    tag3: formattedTags[2],
    makerFees: abi.fix(fees.makerProportionOfFee, "hex"),
    extraInfo: extraInfo || "",
    tx: { value: calculateRequiredMarketValue(rpcInterface.getGasPrice()) },
    onSent: onSent,
    onSuccess: onSuccess,
    onFailed: onFailed
  });
}

module.exports = createMarket;
