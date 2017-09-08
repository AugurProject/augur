"use strict";

var speedomatic = require("speedomatic");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.branchID Branch on which to create this market.
 * @param {number} p._endTime Market expiration timestamp, in seconds.
 * @param {function} callback Called after the market creation cost has been looked up.
 * @return {string} Total cost of creating a new market (= validity bond + target reporter gas costs), as a base-10 string.
 */
function getMarketCreationCost(p, callback) {
  api().Branch.getReportingWindowByTimestamp({
    tx: { to: p.branchID },
    _timestamp: p._endTime
  }, function (reportingWindowAddress) {
    if (!reportingWindowAddress) return callback({ error: "getReportingWindowByTimestamp failed" });
    if (reportingWindowAddress.error) return callback(reportingWindowAddress);
    api().MarketFeeCalculator.getMarketCreationCost({ _reportingWindow: reportingWindowAddress }, function (marketCreationCost) {
      if (!marketCreationCost) return callback({ error: "getMarketCreationCost failed" });
      if (marketCreationCost.error) return callback(marketCreationCost);
      callback(null, speedomatic.unfix(marketCreationCost, "string"));
    });
  });
}

module.exports = getMarketCreationCost;
