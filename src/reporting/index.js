"use strict";

module.exports = {
  getReportingHistory: require("./get-reporting-history"),
  getStakeTokens: require("./get-stake-tokens"),
  getReportingSummary: require("./get-reporting-summary"),
  getFeeWindowsWithUnclaimedFees: require("./get-fee-windows-with-unclaimed-fees"),
  getFeeWindowCurrent: require("./get-fee-window-current"),
  getDisputeInfo: require("./get-dispute-info"),
  getStakeRequiredForDesignatedReporter: require("./get-stake-required-for-designated-reporter"),
  getCurrentPeriodProgress: require("./get-current-period-progress"),
  finalizeMarket: require("./finalize-market"),
};
