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
function getBidAction(shares, limitPrice, makerFee, gasPrice) {
  var bidGasEth = getTxGasEth(clone(functionsAPI.BuyAndSellShares.buy), gasPrice);
  var etherToBid = shares.times(limitPrice).dividedBy(ONE).floor();
  var feeEth = etherToBid.times(makerFee).dividedBy(ONE).floor();
  return {
    action: "BID",
    shares: abi.unfix(shares, "string"),
    gasEth: bidGasEth.toFixed(),
    feeEth: abi.unfix(feeEth, "string"),
    feePercent: abi.unfix(makerFee).times(100).abs().toFixed(),
    costEth: abi.unfix(etherToBid.abs().plus(feeEth)).neg().toFixed(),
    avgPrice: abi.unfix(etherToBid.plus(feeEth).dividedBy(shares).times(ONE).floor(), "string"),
    noFeePrice: abi.unfix(limitPrice, "string")
  };
}

module.exports = getBidAction;
