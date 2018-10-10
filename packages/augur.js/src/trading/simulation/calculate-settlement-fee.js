"use strict";

var constants = require("../../constants");
var ZERO = constants.ZERO;

// sharePrice can be long (taking ask, making a bid) or short (taking bid, making an ask)
// range in this context is used similarly to numTicks
function calculateSettlementFee(completeSets, marketCreatorFeeRate, range, shouldCollectReportingFees, reportingFeeRate, sharePrice) {
  var payout = completeSets.times(sharePrice).times(range);
  var marketCreatorFee = payout.times(marketCreatorFeeRate).div(range);
  var reportingFee = payout.times(shouldCollectReportingFees ? reportingFeeRate : ZERO).div(range);
  var fee = marketCreatorFee.plus(reportingFee);
  return fee;
}

module.exports = calculateSettlementFee;
