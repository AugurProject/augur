"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var functionsAPI = require("augur-contracts").api.functions;
var getTxGasEth = require("./get-tx-gas-eth");
var ONE = require("../../constants").ONE;

/**
 *
 * @param {BigNumber} shortSellEth
 * @param {BigNumber} shares
 * @param {BigNumber} takerFeeEth
 * @param {Number} gasPrice
 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
 */
function getShortSellAction(shortSellEth, shares, takerFeeEth, gasPrice) {
  var shortSellGasEth = getTxGasEth(clone(functionsAPI.Trade.short_sell), gasPrice);
  var fxpShortSellEth = abi.fix(shortSellEth);
  var fxpTakerFeeEth = abi.fix(takerFeeEth);
  var fxpShares = abi.fix(shares);
  return {
    action: "SHORT_SELL",
    shares: shares.toFixed(),
    gasEth: shortSellGasEth.toFixed(),
    feeEth: takerFeeEth.toFixed(),
    feePercent: abi.unfix(fxpTakerFeeEth.dividedBy(fxpShortSellEth).times(ONE).floor().times(100).abs(), "string"),
    costEth: shortSellEth.neg().toFixed(),
    avgPrice: abi.unfix(fxpShortSellEth.dividedBy(fxpShares).times(ONE).floor(), "string"),
    noFeePrice: abi.unfix(fxpShortSellEth.plus(fxpTakerFeeEth).dividedBy(fxpShares).times(ONE).floor(), "string")
  };
}

module.exports = getShortSellAction;
