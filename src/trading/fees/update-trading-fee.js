"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var calculateTradingFees = require("./calculate-trading-fees");
var api = require("../../api");

// { branch, market, takerFee, makerFee, onSent, onSuccess, onFailed }
function updateTradingFee(p) {
  var fees = calculateTradingFees(p.makerFee, p.takerFee);
  return api().CreateMarket.updateTradingFee(assign({}, p, {
    tradingFee: abi.fix(fees.tradingFee, "hex"),
    makerFees: abi.fix(fees.makerProportionOfFee, "hex")
  }));
}

module.exports = updateTradingFee;
