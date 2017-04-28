"use strict";

var abi = require("augur-abi");
var rpcInterface = require("../rpc-interface");
var COST_PER_REPORTER = require("../constants").COST_PER_REPORTER;

function calculateValidityBond(tradingFee, periodLength, baseReporters, numEventsCreatedInPast24Hours, numEventsInReportPeriod) {
  var bnPeriodLength = abi.bignum(periodLength);
  var bnBaseReporters = abi.bignum(baseReporters);
  var bnPast24 = abi.bignum(numEventsCreatedInPast24Hours);
  var bnNumberEvents = abi.bignum(numEventsInReportPeriod);
  var bnGasPrice = abi.bignum(rpcInterface.getGasPrice());
  var creationFee = abi.bignum("0.03").times(bnBaseReporters).dividedBy(tradingFee);
  var minFee = COST_PER_REPORTER.times(bnBaseReporters).times(bnGasPrice);
  if (creationFee.lt(minFee)) creationFee = minFee;
  return creationFee.plus(bnPast24.dividedBy(bnPeriodLength).plus(1))
    .dividedBy(bnNumberEvents.plus(1))
    .dividedBy(2)
    .toFixed();
}

module.exports = calculateValidityBond;
