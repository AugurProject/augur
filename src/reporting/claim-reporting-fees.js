"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var assign = require("lodash.assign");
var api = require("../api");
var contractTypes = require("../constants").CONTRACT_TYPE;
var PARALLEL_LIMIT = require("../constants").PARALLEL_LIMIT;

/**
 * @typedef {Object} RedeemableContract
 * @property {string} address Ethereum address of a FeeWindow, DisputeCrowdsourcer, or InitialReporter from which to redeem fees.
 * @property {number} type Type of smart contract from which to redeem reporting fees: 0 = DisputeCrowdsourcer, 1 = InitialReporter, and 2 = FeeWindow.
 */

 /**
 * @typedef {Object} GasEstimateTotals
 * @property {BigNumber} crowdsourcers Total gas estimate for redeeming all DisputeCrowdsourcer reporting fees.
 * @property {BigNumber} initialReporters Total gas estimate for redeeming all InitialReporter reporting fees.
 * @property {BigNumber} feeWindows Total gas estimate for redeeming all FeeWindow reporting fees.
 * @property {BigNumber} all Sum of all gas estimates.
 */

 /**
 * @typedef {Object} GasEstimateInfo
 * @property {Array.<Object>} crowdsourcers Array of objects containing contract address/gas estimate pairs for all DisputeCrowdsourcers.
 * @property {Array.<Object>} initialReporters Array of objects containing contract address/gas estimate pairs for all InitialReporters.
 * @property {Array.<Object>} feeWindows Array of objects containing contract address/gas estimate pairs for all FeeWindows.
 * @property {GasEstimateTotals} totals Object containing total gas estimates for each type of contract.
 */

 /**
 * @typedef {Object} ClaimReportingFeesInfo
 * @property {Array.<string>|null} redeemedFeeWindows Addresses of all successfully redeemed Fee Windows, as hexadecimal strings. Not set if `p.estimateGas` is true.
 * @property {Array.<string>|null} redeemedCrowdsourcers Addresses of all successfully redeemed Dispute Crowdsourcers, as hexadecimal strings.  Not set if `p.estimateGas` is true.
 * @property {Array.<string>|null} redeemedInitialReporters Addresses of all successfully redeemed Initial Reporters, as hexadecimal strings.  Not set if `p.estimateGas` is true.
 * @property {GasEstimateInfo|null} gasEstimates Object containing a breakdown of gas estimates for all reporting fee redemption transactions. Not set if `p.estimateGas` is false.
 * @property {Array.<string>} failedFeeWindows Array of FeeWindow contract addresses from which reporting fees could not be claimed.
 * @property {Array.<string>} failedCrowdsourcers Array of DisputeCrowdsourcer contract addresses from which reporting fees could not be claimed.
 * @property {Array.<string>} failedInitialReporters Array of InitialReporter contract addresses from which reporting fees could not be claimed.
 */

/**
 * @param {Object} p Parameters object.
 * @param {string} p.redeemer Ethereum address attempting to redeem reporting fees, as a hexadecimal string.
 * @param {Array.<string>} p.crowdsourcers Array of dispute crowdsourcer contract addresses which to claim reporting fees.
 * @param {Array.<string>} p.feeWindows Array of fee window contract addresses from which to claim reporting fees.
 * @param {Array.<string>} p.initialReporters Array of initial reporter contract addresses from which to claim reporting fees.
 * @param {boolean=} p.estimateGas Whether to return gas estimates for the transactions instead of actually making the transactions.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when each transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when any of the transactions fail.
 * @return {ClaimReportingFeesInfo} Object containing information about which fees were successfully claimed or a breakdown of gas estimates.
 */
function claimReportingFees(p) {
  var redeemableContracts = [];
  var i;
  if (p.crowdsourcers) {
    for (i = 0; i < p.crowdsourcers.length; i++) {
      redeemableContracts.push({
        address: p.crowdsourcers[i],
        type: contractTypes.DISPUTE_CROWDSOURCER,
      });
    }
  }
  if (p.feeWindows) {
    for (i = 0; i < p.feeWindows.length; i++) {
      redeemableContracts.push({
        address: p.feeWindows[i],
        type: contractTypes.FEE_WINDOW,
      });
    }
  }
  if (p.initialReporters) {
    for (i = 0; i < p.initialReporters.length; i++) {
      redeemableContracts.push({
        address: p.initialReporters[i],
        type: contractTypes.INITIAL_REPORTER,
      });
    }
  }
  var redeemPayload = immutableDelete(p, ["redeemer", "crowdsourcers", "feeWindows", "initialReporters", "estimateGas"]);
  var redeemedFeeWindows = [];
  var redeemedCrowdsourcers = [];
  var redeemedInitialReporters = [];
  var gasEstimates = {
    crowdsourcers: [],
    initialReporters: [],
    feeWindows: [],
    totals: {
      crowdsourcers: new BigNumber(0),
      initialReporters: new BigNumber(0),
      feeWindows: new BigNumber(0),
      all: new BigNumber(0),
    },
  };
  var failedFeeWindows = [];
  var failedCrowdsourcers = [];
  var failedInitialReporters = [];

  async.eachLimit(redeemableContracts, PARALLEL_LIMIT, function (contract, nextContract) {
    switch (contract.type) {
      case contractTypes.DISPUTE_CROWDSOURCER:
        api().DisputeCrowdsourcer.redeem(assign({}, redeemPayload, {
          _redeemer: p.redeemer,
          tx: {
            to: contract.address,
            estimateGas: p.estimateGas,
          },
          onSent: function () {},
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.crowdsourcers.push({address: contract.address, estimate: result });
              gasEstimates.totals.crowdsourcers = gasEstimates.totals.crowdsourcers.plus(result);
            } else {
              redeemedCrowdsourcers.push(contract.address);
            }
            nextContract();
          },
          onFailed: function () {
            failedCrowdsourcers.push(contract.address);
            nextContract();
          },
        }));
        break;
      case contractTypes.INITIAL_REPORTER:
        api().InitialReporter.redeem(assign({}, redeemPayload, {
          "": p.redeemer,
          tx: {
            to: contract.address,
            estimateGas: p.estimateGas,
          },
          onSent: function () {},
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.initialReporters.push({address: contract.address, estimate: result });
              gasEstimates.totals.initialReporters = gasEstimates.totals.initialReporters.plus(result);
            } else {
              redeemedInitialReporters.push(contract.address);
            }
            nextContract();
          },
          onFailed: function () {
            failedInitialReporters.push(contract.address);
            nextContract();
          },
        }));
        break;
      case contractTypes.FEE_WINDOW:
        api().FeeWindow.redeem(assign({}, redeemPayload, {
          _sender: p.redeemer,
          tx: {
            to: contract.address,
            estimateGas: p.estimateGas,
          },
          onSent: function () {},
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.feeWindows.push({address: contract.address, estimate: result });
              gasEstimates.totals.feeWindows = gasEstimates.totals.feeWindows.plus(result);
            } else {
              redeemedFeeWindows.push(contract.address);
            }
            nextContract();
          },
          onFailed: function () {
            failedFeeWindows.push(contract.address);
            nextContract();
          },
        }));
        break;
      default:
        break;
    }
  }, function () {
    var result = {
      redeemedFeeWindows: redeemedFeeWindows,
      redeemedCrowdsourcers: redeemedCrowdsourcers,
      redeemedInitialReporters: redeemedInitialReporters,
      failedFeeWindows: failedFeeWindows,
      failedCrowdsourcers: failedCrowdsourcers,
      failedInitialReporters: failedInitialReporters,
    };
    if (p.estimateGas) {
      gasEstimates.totals.all = gasEstimates.totals.crowdsourcers.plus(gasEstimates.totals.initialReporters).plus(gasEstimates.totals.feeWindows);
      result = {
        gasEstimates: gasEstimates,
        failedFeeWindows: failedFeeWindows,
        failedCrowdsourcers: failedCrowdsourcers,
        failedInitialReporters: failedInitialReporters,
      };
    }

    if (failedFeeWindows.length > 0 || failedCrowdsourcers > 0 || failedInitialReporters > 0) {
      return p.onFailed(new Error("Not all transactions were successful.\n" + JSON.stringify(result)));
    }
    p.onSuccess(result);
  });
}

module.exports = claimReportingFees;
