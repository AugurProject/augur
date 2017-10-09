"use strict";

module.exports = {
  getOrderBook: require("./get-open-orders"),
  getUserTradingHistory: require("./get-user-trading-history"),
  getUserTradingPositions: require("./get-user-trading-positions"),
  filterByPriceAndOutcomeAndUserSortByPrice: require("./filter-by-price-and-outcome-and-user-sort-by-price"),
  claimMarketsProceeds: require("./claim-markets-proceeds"),
  simulateTrade: require("./simulation"),
  calculateProfitLoss: require("./profit-loss"),
  normalizePrice: require("./normalize-price"),
  denormalizePrice: require("./denormalize-price"),
  tradeUntilAmountIsZero: require("./trade-until-amount-is-zero")
};
