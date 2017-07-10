"use strict";

var abi = require("augur-abi");
var crypto = require("crypto");
var ZERO = require("../../constants").ZERO;

function calculateTradeTotals(type, numShares, limitPrice, tradeActions) {
  var tradeActionsTotals, numTradeActions, totalCost, tradingFeesEth, gasFeesRealEth, i;
  tradeActionsTotals = {
    numShares: numShares,
    limitPrice: limitPrice,
    side: type,
    totalFee: 0,
    totalCost: 0,
    tradeGroupID: "0x" + crypto.randomBytes(32).toString("hex")
  };
  numTradeActions = tradeActions.length;
  if (!numTradeActions) return tradeActionsTotals;
  totalCost = ZERO;
  tradingFeesEth = ZERO;
  gasFeesRealEth = ZERO;
  for (i = 0; i < numTradeActions; ++i) {
    totalCost = totalCost.plus(abi.bignum(tradeActions[i].costEth));
    tradingFeesEth = tradingFeesEth.plus(abi.bignum(tradeActions[i].feeEth));
    gasFeesRealEth = gasFeesRealEth.plus(abi.bignum(tradeActions[i].gasEth));
  }
  tradeActionsTotals.tradeActions = tradeActions;
  tradeActionsTotals.totalCost = totalCost.toFixed();
  tradeActionsTotals.tradingFeesEth = tradingFeesEth.toFixed();
  tradeActionsTotals.gasFeesRealEth = gasFeesRealEth.toFixed();
  tradeActionsTotals.totalFee = tradingFeesEth.toFixed();
  if (type === "sell") {
    tradeActionsTotals.feePercent = tradingFeesEth.dividedBy(totalCost.minus(tradingFeesEth))
      .times(100).abs()
      .toFixed();
  } else {
    tradeActionsTotals.feePercent = tradingFeesEth.dividedBy(totalCost.plus(tradingFeesEth))
      .times(100).abs()
      .toFixed();
  }
  return tradeActionsTotals;
}

module.exports = calculateTradeTotals;
