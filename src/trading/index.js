"use strict";

module.exports = {
  getBetterWorseOrders: require("./get-better-worse-orders"),
  getUserTradingHistory: require("./get-user-trading-history"),
  getUserTradingPositions: require("./get-user-trading-positions"),
  getPositionInMarket: require("./get-position-in-market"),
  filterAndSortByPrice: require("./filter-and-sort-by-price"),
  claimMarketsTradingProceeds: require("./claim-markets-trading-proceeds"),
  claimTradingProceeds: require("./claim-trading-proceeds"),
  simulateTrade: require("./simulation"),
  calculateProfitLoss: require("./profit-loss"),
  normalizePrice: require("./normalize-price"),
  denormalizePrice: require("./denormalize-price"),
  placeTrade: require("./place-trade"),
  tradeUntilAmountIsZero: require("./trade-until-amount-is-zero"),
  getOrders: require("./get-orders"),
  calculateTradeCost: require("./calculate-trade-cost"),
  generateTradeGroupId: require("./generate-trade-group-id"),
};
