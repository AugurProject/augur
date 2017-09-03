"use strict";

var speedomatic = require("speedomatic");
var rpcInterface = require("../rpc-interface");
var COST_PER_REPORTER = require("../constants").COST_PER_REPORTER;

function calculateValidityBond(tradingFee, periodLength, baseReporters, numEventsCreatedInPast24Hours, numEventsInReportPeriod) {
  var bnPeriodLength = speedomatic.bignum(periodLength);
  var bnBaseReporters = speedomatic.bignum(baseReporters);
  var bnPast24 = speedomatic.bignum(numEventsCreatedInPast24Hours);
  var bnNumberEvents = speedomatic.bignum(numEventsInReportPeriod);
  var bnGasPrice = speedomatic.bignum(rpcInterface.getGasPrice());
  var creationFee = speedomatic.bignum("0.03").times(bnBaseReporters).dividedBy(tradingFee);
  var minFee = COST_PER_REPORTER.times(bnBaseReporters).times(bnGasPrice);
  if (creationFee.lt(minFee)) creationFee = minFee;
  return creationFee.plus(bnPast24.dividedBy(bnPeriodLength).plus(1))
    .dividedBy(bnNumberEvents.plus(1))
    .dividedBy(2)
    .toFixed();
}

module.exports = calculateValidityBond;
