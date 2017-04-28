"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var functionsAPI = require("augur-contracts").api.functions;
var getTxGasEth = require("./get-tx-gas-eth");
var ONE = require("../../constants").ONE;

/**
 *
 * @param {BigNumber} buyEth
 * @param {BigNumber} sharesFilled
 * @param {BigNumber} takerFeeEth
 * @param {Number} gasPrice
 * @return {{action: string, shares: string, gasEth, feeEth: string, costEth: string, avgPrice: string}}
 */
function getBuyAction(buyEth, sharesFilled, takerFeeEth, gasPrice) {
  var tradeGasEth = getTxGasEth(clone(functionsAPI.Trade.trade), gasPrice);
  var fxpBuyEth = abi.fix(buyEth);
  var fxpTakerFeeEth = abi.fix(takerFeeEth);
  var fxpSharesFilled = abi.fix(sharesFilled);
  return {
    action: "BUY",
    shares: sharesFilled.toFixed(),
    gasEth: tradeGasEth.toFixed(),
    feeEth: takerFeeEth.toFixed(),
    feePercent: abi.unfix(fxpTakerFeeEth.dividedBy(fxpBuyEth).times(ONE).floor().times(100).abs(), "string"),
    costEth: buyEth.neg().toFixed(),
    avgPrice: abi.unfix(fxpBuyEth.dividedBy(fxpSharesFilled).times(ONE).floor(), "string"),
    noFeePrice: abi.unfix(fxpBuyEth.minus(fxpTakerFeeEth).dividedBy(fxpSharesFilled).times(ONE).floor(), "string")
  };
}

module.exports = getBuyAction;
