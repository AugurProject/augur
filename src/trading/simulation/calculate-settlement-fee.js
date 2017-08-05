"use strict";

var constants = require("../../constants");
var ZERO = constants.ZERO;

// sharePrice can be long (taking ask) or short (taking bid)
function calculateSettlementFee(completeSets, marketCreatorFeeRate, range, shouldCollectReportingFees, reportingFeeRate, sharePrice) {
  console.log("completeSets:", completeSets.toFixed());
  console.log("marketCreatorFeeRate:", marketCreatorFeeRate.toFixed());
  console.log("range:", range.toFixed());
  console.log("shouldCollectReportingFees:", shouldCollectReportingFees);
  console.log("reportingFeeRate:", reportingFeeRate.toFixed());
  console.log("sharePrice:", sharePrice.toFixed());
  console.log();
  var marketCreatorFee = marketCreatorFeeRate.times(completeSets).times(range);
  console.log("marketCreatorFee:", marketCreatorFee.toFixed());
  var reportingFee = (shouldCollectReportingFees) ? reportingFeeRate.times(completeSets).times(range) : ZERO;
  console.log("reportingFee:", reportingFee.toFixed());
  var completeSetPayout = completeSets.times(range).minus(marketCreatorFee).minus(reportingFee);
  console.log("completeSetPayout:", completeSetPayout.toFixed());
  var completeSetFee = marketCreatorFee.plus(reportingFee);
  console.log("completeSetFee:", completeSetFee.toFixed());
  var makerFee = completeSetFee.times(sharePrice).dividedBy(range);
  var takerFee = completeSetFee.minus(makerFee);
  console.log("makerFee:", makerFee.toFixed());
  console.log("takerFee:", takerFee.toFixed());
  return takerFee;
}

module.exports = calculateSettlementFee;
