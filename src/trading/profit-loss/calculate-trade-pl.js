"use strict";

var BigNumber = require("bignumber.js");
var calculateTakerPL = require("./calculate-taker-pl");
var sellCompleteSetsPL = require("./sell-complete-sets-pl");
var calculateMakerPL = require("./calculate-maker-pl");

function calculateTradePL(PL, trade) {
  if (trade.isCompleteSet) {
    if (trade.type === "buy") {
      return calculateTakerPL(PL, trade.type, new BigNumber(trade.price, 10), new BigNumber(trade.amount, 10));
    }
    return sellCompleteSetsPL(PL, new BigNumber(trade.amount, 10), new BigNumber(trade.price, 10));
  } else if (trade.maker) {
    return calculateMakerPL(PL, trade.type, new BigNumber(trade.price, 10), new BigNumber(trade.amount, 10));
  }
  return calculateTakerPL(PL, trade.type, new BigNumber(trade.price, 10), new BigNumber(trade.amount, 10));
}

module.exports = calculateTradePL;
