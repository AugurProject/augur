"use strict";

module.exports = {
  getUserTradingHistory: require("./get-user-trading-history"),
  getUserTradingPositions: require("./get-user-trading-positions"),
  orderBook: require("./order-book"),
  claimMarketsProceeds: require("./claim-markets-proceeds"),
  simulateTrade: require("./simulation"),
  calculateProfitLoss: require("./profit-loss"),
  normalizePrice: require("./normalize-price"),
  denormalizePrice: require("./denormalize-price"),
  tradeUntilAmountIsZero: require("./trade-until-amount-is-zero")
};
