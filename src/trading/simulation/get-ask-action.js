"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var functionsAPI = require("augur-contracts").api.functions;
var getTxGasEth = require("./get-tx-gas-eth");
var ONE = require("../../constants").ONE;

/**
 *
 * @param {BigNumber} shares
 * @param {BigNumber} limitPrice
 * @param {BigNumber} makerFee
 * @param {Number} gasPrice
 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
 */
function getAskAction(shares, limitPrice, makerFee, gasPrice) {
  var askGasEth = getTxGasEth(clone(functionsAPI.BuyAndSellShares.sell), gasPrice);
  var costEth = shares.times(limitPrice).dividedBy(ONE).floor();
  var feeEth = costEth.times(makerFee).dividedBy(ONE).floor();
  return {
    action: "ASK",
    shares: abi.unfix(shares, "string"),
    gasEth: askGasEth.toFixed(),
    feeEth: abi.unfix(feeEth, "string"),
    feePercent: abi.unfix(makerFee).times(100).toFixed(),
    costEth: abi.unfix(costEth.minus(feeEth), "string"),
    avgPrice: abi.unfix(costEth.minus(feeEth).dividedBy(shares).times(ONE).floor().abs(), "string"),
    noFeePrice: abi.unfix(limitPrice, "string")
  };
}

module.exports = getAskAction;
