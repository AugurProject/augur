"use strict";

var abi = require("augur-abi");
var calculateTradingFees = require("./calculate-trading-fees");
var api = require("../../api");
var isObject = require("../../utils/is-object");

function updateTradingFee(branch, market, takerFee, makerFee, onSent, onSuccess, onFailed) {
  var fees;
  if (isObject(branch)) {
    market = branch.market;
    takerFee = branch.takerFee;
    makerFee = branch.makerFee;
    onSent = branch.onSent;
    onSuccess = branch.onSuccess;
    onFailed = branch.onFailed;
    branch = branch.branch;
  }
  fees = calculateTradingFees(makerFee, takerFee);
  return api.CreateMarket.updateTradingFee({
    branch: branch,
    market: market,
    tradingFee: abi.fix(fees.tradingFee, "hex"),
    makerFees: abi.fix(fees.makerProportionOfFee, "hex"),
    onSent: onSent,
    onSuccess: onSuccess,
    onFailed: onFailed
  });
}

module.exports = updateTradingFee;
