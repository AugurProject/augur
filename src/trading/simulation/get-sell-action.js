"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var functionsAPI = require("augur-contracts").api.functions;
var getTxGasEth = require("./get-tx-gas-eth");
var ONE = require("../../constants").ONE;

/**
 *
 * @param {BigNumber} sellEth
 * @param {BigNumber} sharesFilled
 * @param {BigNumber} takerFeeEth
 * @param {Number} gasPrice
 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
 */
function getSellAction(sellEth, sharesFilled, takerFeeEth, gasPrice) {
  var tradeGasEth = getTxGasEth(clone(functionsAPI.Trade.trade), gasPrice);
  var fxpSellEth = abi.fix(sellEth);
  var fxpSharesFilled = abi.fix(sharesFilled);
  var fxpTakerFeeEth = abi.fix(takerFeeEth);
  return {
    action: "SELL",
    shares: sharesFilled.toFixed(),
    gasEth: tradeGasEth.toFixed(),
    feeEth: takerFeeEth.toFixed(),
    feePercent: abi.unfix(fxpTakerFeeEth.dividedBy(fxpSellEth).times(ONE).floor().times(100).abs(), "string"),
    costEth: sellEth.toFixed(),
    avgPrice: abi.unfix(fxpSellEth.dividedBy(fxpSharesFilled).times(ONE).floor(), "string"),
    noFeePrice: abi.unfix(fxpSellEth.plus(fxpTakerFeeEth).dividedBy(fxpSharesFilled).times(ONE).floor(), "string")
  };
}

module.exports = getSellAction;
