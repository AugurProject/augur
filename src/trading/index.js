"use strict";

module.exports = {
  orderBook: require("./order-book"),
  payout: require("./payout"),
  positions: require("./positions"),
  simulation: require("./simulation"),
  cancel: require("./cancel"),
  normalizePrice: require("./normalize-price"),
  denormalizePrice: require("./denormalize-price"),
  getTradeAmountRemaining: require("./get-trade-amount-remaining"),
  decreaseTradingFee: require("./decrease-trading-fee")
};
