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
 * @property {BigNumber} disputeCrowdsourcers Total gas estimate for redeeming all DisputeCrowdsourcer reporting fees.
 * @property {BigNumber} initialReporters Total gas estimate for redeeming all InitialReporter reporting fees.
 * @property {BigNumber} feeWindows Total gas estimate for redeeming all FeeWindow reporting fees.
 * @property {BigNumber} all Sum of all gas estimates.
 */

 /**
 * @typedef {Object} GasEstimateInfo
 * @property {Array.<Object>} disputeCrowdsourcers Array of objects containing contract address/gas estimate pairs for all DisputeCrowdsourcers.
 * @property {Array.<Object>} initialReporters Array of objects containing contract address/gas estimate pairs for all InitialReporters.
 * @property {Array.<Object>} feeWindows Array of objects containing contract address/gas estimate pairs for all FeeWindows.
 * @property {GasEstimateTotals} totals Object containing total gas estimates for each type of contract.
 */

/**
 * @typedef {Object} FailedTransaction
 * @property {string} address Ethereum address of contract that returned a transaction error.
 * @property {RPCError|Error} error Error that occurred when attempting to make a transaction to the contract.
 */

 /**
 * @typedef {Object} ClaimReportingFeesInfo
 * @property {Array.<string>|null} redeemedFeeWindows Addresses of all successfully redeemed Fee Windows, as hexadecimal strings. Not set if `p.estimateGas` is true.
 * @property {Array.<string>|null} redeemedDisputeCrowdsourcers Addresses of all successfully redeemed Dispute Crowdsourcers, as hexadecimal strings.  Not set if `p.estimateGas` is true.
 * @property {Array.<string>|null} redeemedInitialReporters Addresses of all successfully redeemed Initial Reporters, as hexadecimal strings.  Not set if `p.estimateGas` is true.
 * @property {GasEstimateInfo|null} gasEstimates Object containing a breakdown of gas estimates for all reporting fee redemption transactions. Not set if `p.estimateGas` is false.
 * @property {Array.<FailedTransaction>} failedTransactions Array of FailedTransaction objects containing error information about each failed transaction.
 */

/**
 * @param {Object} p Parameters object.
 * @param {string} p.redeemer Ethereum address attempting to redeem reporting fees, as a hexadecimal string.
 * @param {Array.<RedeemableContract>} p.redeemableContracts Array of objects containing contract address and contract type pairs.
 * @param {boolean=} p.estimateGas Whether to return gas estimates for the transactions instead of actually making the transactions.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} callback Called after all transactions have been attempted.
 * @return {ClaimReportingFeesInfo} Object containing information about which fees were successfully claimed or a breakdown of gas estimates.
 */
function claimReportingFees(p, callback) {
  var redeemPayload = immutableDelete(p, ["redeemer", "redeemableContracts", "estimateGas"]);
  var redeemedFeeWindows = [];
  var redeemedDisputeCrowdsourcers = [];
  var redeemedInitialReporters = [];
  var gasEstimates = {
    disputeCrowdsourcers: [],
    initialReporters: [],
    feeWindows: [],
    totals: {
      disputeCrowdsourcers: new BigNumber(0),
      initialReporters: new BigNumber(0),
      feeWindows: new BigNumber(0),
      all: new BigNumber(0),
    },
  };
  var failedTransactions = [];

  async.eachLimit(p.redeemableContracts, PARALLEL_LIMIT, function (contract, nextContract) {
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
              gasEstimates.disputeCrowdsourcers.push({address: contract.address, estimate: result });
              gasEstimates.totals.disputeCrowdsourcers = gasEstimates.totals.disputeCrowdsourcers.plus(result);
            } else {
              redeemedDisputeCrowdsourcers.push(contract.address);
            }
            nextContract();
          },
          onFailed: function (err) {
            failedTransactions.push({address: contract.address, error: err});
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
          onFailed: function (err) {
            failedTransactions.push({address: contract.address, error: err});
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
          onFailed: function (err) {
            failedTransactions.push({address: contract.address, error: err});
            nextContract();
          },
        }));
        break;
      default:
        failedTransactions.push({address: contract.address, error: "Unknown contract type: " + contract.type});
        nextContract();
        break;
    }
  }, function () {
    var result = {
      redeemedFeeWindows: redeemedFeeWindows,
      redeemedDisputeCrowdsourcers: redeemedDisputeCrowdsourcers,
      redeemedInitialReporters: redeemedInitialReporters,
      failedTransactions: failedTransactions,
    };
    if (p.estimateGas) {
      gasEstimates.totals.all = gasEstimates.totals.disputeCrowdsourcers.plus(gasEstimates.totals.initialReporters).plus(gasEstimates.totals.feeWindows);
      result = {
        gasEstimates: gasEstimates,
        failedTransactions: failedTransactions,
      };
    }
    var err = null;
    if (failedTransactions.length > 0) {
      err = new Error("Not all transactions were successful. See returned failedTransactions parameter for details.");
    }
    callback(err, result);
  });
}

module.exports = claimReportingFees;
