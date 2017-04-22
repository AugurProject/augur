"use strict";

var abi = require("augur-abi");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var calculateRequiredMarketValue = require("../create/calculate-required-market-value");
var calculateTradingFees = require("../trading/fees/calculate-trading-fees");
var encodeTagArray = require("../format/tag/encode-tag-array");
var isObject = require("../utils/is-object");

function createSingleEventMarket(branch, description, expDate, minValue, maxValue, numOutcomes, resolution, takerFee, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
  var formattedTags, fees;
  if (isObject(branch)) {
    description = branch.description;
    expDate = branch.expDate;
    minValue = branch.minValue;
    maxValue = branch.maxValue;
    numOutcomes = branch.numOutcomes;
    resolution = branch.resolution;
    takerFee = branch.takerFee;
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
  expDate = parseInt(expDate, 10);
  if (description) description = description.trim();
  if (resolution) resolution = resolution.trim();
  api.CreateMarket.createSingleEventMarket({
    branch: branch,
    description: description,
    expDate: expDate,
    minValue: abi.fix(minValue, "hex"),
    maxValue: abi.fix(maxValue, "hex"),
    numOutcomes: numOutcomes,
    resolution: resolution || "",
    tradingFee: abi.fix(fees.tradingFee, "hex"),
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

module.exports = createSingleEventMarket;
