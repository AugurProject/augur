"use strict";

module.exports = {
  batchGetMarketInfo: require("./batch-get-market-info"),
  getMarketInfo: require("./get-market-info"),
  getMarketsInfo: require("./get-markets-info"),
  getDetailedMarketInfo: require("./get-detailed-market-info"),
  getDisputableMarkets: require("./get-disputable-markets"),
  getMarketPriceHistory: require("./get-market-price-history"),
  getMarketsAwaitingAllReporting: require("./get-markets-awaiting-all-reporting"),
  getMarketsAwaitingDesignatedReporting: require("./get-markets-awaiting-designated-reporting"),
  getMarketsAwaitingLimitedReporting: require("./get-markets-awaiting-limited-reporting"),
  getMarketsClosingInDateRange: require("./get-markets-closing-in-date-range"),
  getMarketsCreatedByUser: require("./get-markets-created-by-user"),
  getTopics: require("./get-topics")
};
