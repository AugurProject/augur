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
 * @return {{action: string, shares: string, gasEth: string, feeEth: string, costEth: string, avgPrice: string}}
 */
function getShortAskAction(shares, limitPrice, makerFee, gasPrice) {
  var buyCompleteSetsGasEth = getTxGasEth(clone(functionsAPI.CompleteSets.buyCompleteSets), gasPrice);
  var askGasEth = getTxGasEth(clone(functionsAPI.BuyAndSellShares.sell), gasPrice);
  var feeEth = shares.times(limitPrice).dividedBy(ONE).floor().times(makerFee).dividedBy(ONE).floor();
  var costEth = shares.neg().minus(feeEth);
  return {
    action: "SHORT_ASK",
    shares: abi.unfix(shares, "string"),
    gasEth: buyCompleteSetsGasEth.plus(askGasEth).toFixed(),
    feeEth: abi.unfix(feeEth, "string"),
    feePercent: abi.unfix(makerFee).times(100).abs().toFixed(),
    costEth: abi.unfix(costEth, "string"),
    avgPrice: abi.unfix(costEth.neg().dividedBy(shares).times(ONE).floor(), "string"),
    noFeePrice: abi.unfix(limitPrice, "string") // "limit price" (not really no fee price)
  };
}

module.exports = getShortAskAction;
