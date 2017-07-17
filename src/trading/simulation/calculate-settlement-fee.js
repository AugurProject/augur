"use strict";

var constants = require("../../constants");
var ZERO = constants.ZERO;

// sharePrice can be long or short
function calculateSettlementFee(completeSets, marketCreatorFeeRate, range, shouldCollectReportingFees, reportingFeeRate, sharePrice) {
  var marketCreatorFee = marketCreatorFeeRate.times(completeSets).times(range);
  var reportingFee = (shouldCollectReportingFees) ? reportingFeeRate.times(completeSets).times(range) : ZERO;
  var completeSetFee = marketCreatorFee.plus(reportingFee);
  var fee = completeSetFee.times(sharePrice).dividedBy(range);
  var makerShare = completeSets.times(sharePrice).minus(fee);
  var takerShare = completeSetFee.minus(makerShare);
  return takerShare;
}

module.exports = calculateSettlementFee;
