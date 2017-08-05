"use strict";

var constants = require("../../constants");
var ZERO = constants.ZERO;

// sharePrice can be long (taking ask) or short (taking bid)
function calculateSettlementFee(completeSets, marketCreatorFeeRate, range, shouldCollectReportingFees, reportingFeeRate, sharePrice) {
  var marketCreatorFee = marketCreatorFeeRate.times(completeSets).times(range);
  var reportingFee = (shouldCollectReportingFees) ? reportingFeeRate.times(completeSets).times(range) : ZERO;
  var completeSetFee = marketCreatorFee.plus(reportingFee);
  var makerFee = completeSetFee.times(sharePrice).dividedBy(range);
  var takerFee = completeSetFee.minus(makerFee);
  return takerFee;
}

module.exports = calculateSettlementFee;
