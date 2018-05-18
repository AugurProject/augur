"use strict";

var BigNumber = require("bignumber.js");
var ethrpc = require("../rpc-interface");
var constants = require("../constants");

/**
 * publicTrade/publicTakeBestOrder will continue to execute as long as sufficient gas remains and
 * there are still orders to fill (or create).  This prevents eth_estimateGas from working properly.
 * The gas supplied to these transactions is instead based on the current block gas limit.
 * @return {BigNumber} Amount of gas to include.
 */
function calculateTradeGas() {
  var currentBlock = ethrpc.getCurrentBlock();
  if (currentBlock == null) return constants.MINIMUM_TRADE_GAS;
  var blockGasLimit = new BigNumber(currentBlock.gasLimit, 16);
  var tradeGasLowerBound = blockGasLimit.times(constants.TRADE_GAS_LOWER_BOUND_MULTIPLIER).integerValue(BigNumber.ROUND_UP);
  var tradeGasUpperBound = blockGasLimit.times(constants.TRADE_GAS_UPPER_BOUND_MULTIPLIER).integerValue(BigNumber.ROUND_DOWN);
  if (tradeGasUpperBound.lt(constants.MINIMUM_TRADE_GAS)) return constants.MINIMUM_TRADE_GAS;
  if (tradeGasLowerBound.gt(constants.MINIMUM_TRADE_GAS)) return tradeGasLowerBound;
  return tradeGasUpperBound;
}

module.exports = calculateTradeGas;
