"use strict";

var constants = require("../../constants");
var ZERO = constants.ZERO;

// sharePrice can be long (taking ask) or short (taking bid)
function calculateCreatorSettlementFee(completeSets, marketCreatorFeeRate, range, shouldCollectReportingFees, reportingFeeRate, sharePrice) {
  var marketCreatorFee = marketCreatorFeeRate.times(completeSets).times(range);
  var reportingFee = (shouldCollectReportingFees) ? reportingFeeRate.times(completeSets).times(range) : ZERO;
  var completeSetFee = marketCreatorFee.plus(reportingFee);
  var creatorFee = completeSetFee.times(sharePrice).dividedBy(range);
  return creatorFee;
}

module.exports = calculateCreatorSettlementFee;
