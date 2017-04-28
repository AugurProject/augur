"use strict";

module.exports = {
  calculateAdjustedTradingFee: require("./calculate-adjusted-trading-fee"),
  calculateFxpAdjustedTradingFee: require("./calculate-fxp-adjusted-trading-fee"),
  calculateTradingCost: require("./calculate-trading-cost"),
  calculateFxpTradingCost: require("./calculate-fxp-trading-cost"),
  calculateTradingFees: require("./calculate-trading-fees"),
  calculateFxpTradingFees: require("./calculate-fxp-trading-fees"),
  calculateMakerTakerFees: require("./calculate-maker-taker-fees"),
  calculateFxpMakerTakerFees: require("./calculate-fxp-maker-taker-fees"),
  updateTradingFee: require("./update-trading-fee")
};
