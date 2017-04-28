"use strict";

var BigNumber = require("bignumber.js");
var adjustScalarOrder = require("./adjust-scalar-order");
var roundToPrecision = require("../../utils/round-to-precision");
var constants = require("../../constants");

// note: minValue required only for scalar markets
function convertAddTxLogToOrder(log, marketType, minValue) {
  var round, roundingMode, adjustedLog;
  if (log.type === "buy") {
    round = "floor";
    roundingMode = BigNumber.ROUND_DOWN;
  } else {
    round = "ceil";
    roundingMode = BigNumber.ROUND_UP;
  }
  adjustedLog = marketType === "scalar" ? adjustScalarOrder(log, minValue) : log;
  return {
    id: adjustedLog.tradeid,
    type: adjustedLog.type,
    market: adjustedLog.market,
    amount: roundToPrecision(new BigNumber(adjustedLog.amount, 10), constants.MINIMUM_TRADE_SIZE),
    fullPrecisionAmount: adjustedLog.amount,
    price: roundToPrecision(new BigNumber(adjustedLog.price, 10), constants.PRECISION.zero, round, roundingMode),
    fullPrecisionPrice: adjustedLog.price,
    owner: adjustedLog.sender,
    block: adjustedLog.blockNumber,
    outcome: adjustedLog.outcome.toString()
  };
}

module.exports = convertAddTxLogToOrder;
