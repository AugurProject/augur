"use strict";

module.exports = {
  getMarketsInfo: require("./get-markets-info"),
  getDisputableMarkets: require("./get-disputable-markets"),
  getMarketPriceHistory: require("./get-market-price-history"),
  getMarkets: require("./get-markets"),
  getMarketsAwaitingReporting: require("./get-markets-awaiting-reporting"),
  getMarketsAwaitingDesignatedReporting: require("./get-markets-awaiting-designated-reporting"),
  getMarketsInCategory: require("./get-markets-in-category"),
  getMarketsClosingInDateRange: require("./get-markets-closing-in-date-range"),
  getMarketsCreatedByUser: require("./get-markets-created-by-user"),
  getCategories: require("./get-categories"),
};
