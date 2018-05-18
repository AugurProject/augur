"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var assign = require("lodash").assign;
var api = require("../api");
var contractTypes = require("../constants").CONTRACT_TYPE;
var PARALLEL_LIMIT = require("../constants").PARALLEL_LIMIT;

/**
 * @typedef {Object} CrowdsourcerState
 * @property {string} crowdsourcerId Ethereum contract address of a DisputeCrowdsourcer belonging to a Forked Market, as a hexadecimal string.
 * @property {boolean} needsFork Whether `DisputeCrowdsourcer.fork` has been called successfully on the DisputeCrowdsourcer.
 */

/**
 * @typedef {Object} InitialReporterState
 * @property {string} initialReporterId Ethereum contract address of the InitialReporter belonging to a Forked Market, as a hexadecimal string.
 * @property {boolean} needsFork Whether `InitialReporter.fork` has been called successfully on the InitialReporter.
 */

/**
 * @typedef {Object} ForkedMarket
 * @property {string} marketId Ethereum contract address of the Forked Market, as a hexadecimal string.
 * @property {string} universeAddress Ethereum contract address of Universe to which the Forked Market belongs, as a hexadecimal string.
 * @property {boolen} isFinalized Whether the Forked Market has been Finalized (i.e., the function `Market.finalize` has been called on it successfully).
 * @property {Array.<CrowdsourcerState>} crowdsourcers Array of objects containing information about the Forked Market’s DisputeCrowdsourcers.
 * @property {InitialReporterState|null} initialReporter Object containing information about the Forked Market’s InitialReporter.
 */

/**
 * Claims all reporting fees for a user as follows:
 *
 * For each reporting participant of the forked market in which the user has unclaimed fees:
 *   If `DisputeCrowdsourcer.fork`/`InitialReporter.fork` has not been called:
 *     Call `DisputeCrowdsourcer.forkAndRedeem`/`InitialReporter.forkAndRedeem`
 *   Else:
 *     Call `DisputeCrowdsourcer.redeem`/`InitialReporter.redeem`
 *
 * @param {Object} p Parameters object.
 * @param {string} p.redeemer Ethereum address attempting to redeem reporting fees, as a hexadecimal string.
 * @param {ForkedMarket} p.forkedMarket Object containing information about the Forked Market in which the user has unclaimed fees in the Parent Universe(if there is one).
 * @param {boolean} p.estimateGas Whether to return gas estimates for the transactions instead of actually making the transactions.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transactions are broadcast to the network. (Currently used as a placeholder and not actually used by this function.)
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when all transactions have been attempted and at least one transaction has failed. Error message shows which transactions succeeded and which ones failed.
 */
function claimReportingFeesForkedMarket(p) {
  var payload = immutableDelete(p, ["redeemer", "forkedMarket", "estimateGas", "onSent", "onSuccess", "onFailed"]);
  var successfulTransactions = {
    crowdsourcerForkAndRedeem: [],
    initialReporterForkAndRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var failedTransactions = {
    crowdsourcerForkAndRedeem: [],
    initialReporterForkAndRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var gasEstimates = {
    crowdsourcerForkAndRedeem: [],
    initialReporterForkAndRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
    totals: {
      crowdsourcerForkAndRedeem: new BigNumber(0),
      initialReporterForkAndRedeem: new BigNumber(0),
      crowdsourcerRedeem: new BigNumber(0),
      initialReporterRedeem: new BigNumber(0),
      all: new BigNumber(0),
    },
  };

  var redeemableContracts = [];
  var i;
  if (p.forkedMarket) {
    if (p.forkedMarket.crowdsourcers) {
      for (i = 0; i < p.forkedMarket.crowdsourcers.length; i++) {
        redeemableContracts.push({
          address: p.forkedMarket.crowdsourcers[i].crowdsourcerId,
          needsFork: p.forkedMarket.crowdsourcers[i].needsFork,
          type: contractTypes.DISPUTE_CROWDSOURCER,
        });
      }
    }
    if (p.forkedMarket.initialReporter && p.forkedMarket.initialReporter.initialReporterId) {
      redeemableContracts.push({
        address: p.forkedMarket.initialReporter.initialReporterId,
        needsFork: p.forkedMarket.initialReporter.needsFork,
        type: contractTypes.INITIAL_REPORTER,
      });
    }
  }

  async.eachLimit(redeemableContracts, PARALLEL_LIMIT, function (contract, nextContract) {
    switch (contract.type) {
      case contractTypes.DISPUTE_CROWDSOURCER:
        if (contract.needsFork) {
          api().DisputeCrowdsourcer.forkAndRedeem(assign({}, payload, {
            tx: {
              to: contract.address,
              estimateGas: p.estimateGas,
            },
            onSent: function () {},
            onSuccess: function (result) {
              if (p.estimateGas) {
                result = new BigNumber(result, 16);
                gasEstimates.crowdsourcerForkAndRedeem.push({address: contract.address, estimate: result});
                gasEstimates.totals.crowdsourcerForkAndRedeem = gasEstimates.totals.crowdsourcerForkAndRedeem.plus(result);
              } else {
                successfulTransactions.crowdsourcerForkAndRedeem.push(contract.address);
              }
              // console.log("Forked and redeemed crowdsourcer", contract.address);
              nextContract();
            },
            onFailed: function () {
              failedTransactions.crowdsourcerForkAndRedeem.push(contract.address);
              // console.log("Failed to forkAndRedeem crowdsourcer", contract.address);
              nextContract();
            },
          }));
        } else {
          api().DisputeCrowdsourcer.redeem(assign({}, payload, {
            _redeemer: p.redeemer,
            tx: {
              to: contract.address,
              estimateGas: p.estimateGas,
            },
            onSent: function () {},
            onSuccess: function (result) {
              if (p.estimateGas) {
                result = new BigNumber(result, 16);
                gasEstimates.crowdsourcerRedeem.push({address: contract.address, estimate: result});
                gasEstimates.totals.crowdsourcerRedeem = gasEstimates.totals.crowdsourcerRedeem.plus(result);
              } else {
                successfulTransactions.crowdsourcerRedeem.push(contract.address);
              }
              // console.log("Redeemed crowdsourcer", contract.address);
              nextContract();
            },
            onFailed: function () {
              failedTransactions.crowdsourcerRedeem.push(contract.address);
              // console.log("Failed to redeem crowdsourcer", contract.address);
              nextContract();
            },
          }));
        }
        break;
      case contractTypes.INITIAL_REPORTER:
        if (contract.needsFork) {
          api().InitialReporter.forkAndRedeem(assign({}, payload, {
            tx: {
              to: contract.address,
              estimateGas: p.estimateGas,
            },
            onSent: function () {},
            onSuccess: function (result) {
              if (p.estimateGas) {
                result = new BigNumber(result, 16);
                gasEstimates.initialReporterForkAndRedeem.push({address: contract.address, estimate: result});
                gasEstimates.totals.initialReporterForkAndRedeem = gasEstimates.totals.initialReporterForkAndRedeem.plus(result);
              } else {
                successfulTransactions.initialReporterForkAndRedeem.push(contract.address);
              }
              // console.log("Forked and redeemed initialReporter", contract.address);
              nextContract();
            },
            onFailed: function () {
              failedTransactions.initialReporterForkAndRedeem.push(contract.address);
              // console.log("Failed to forkAndRedeem initialReporter", contract.address);
              nextContract();
            },
          }));
        } else {
          api().InitialReporter.redeem(assign({}, payload, {
            "": p.redeemer,
            tx: {
              to: contract.address,
              estimateGas: p.estimateGas,
            },
            onSent: function () {},
            onSuccess: function (result) {
              if (p.estimateGas) {
                result = new BigNumber(result, 16);
                gasEstimates.initialReporterRedeem.push({address: contract.address, estimate: result});
                gasEstimates.totals.initialReporterRedeem = gasEstimates.totals.initialReporterRedeem.plus(result);
              } else {
                successfulTransactions.initialReporterRedeem.push(contract.address);
              }
              // console.log("Redeemed initialReporter", contract.address);
              nextContract();
            },
            onFailed: function () {
              failedTransactions.initialReporterRedeem.push(contract.address);
              // console.log("Failed to redeem initialReporter", contract.address);
              nextContract();
            },
          }));
        }
        break;
      default:
        nextContract();
        break;
    }
  }, function () {
    var result = {
      successfulTransactions: successfulTransactions,
    };
    if (p.estimateGas) {
      gasEstimates.totals.all = gasEstimates.totals.crowdsourcerForkAndRedeem
                                .plus(gasEstimates.totals.initialReporterForkAndRedeem)
                                .plus(gasEstimates.totals.crowdsourcerRedeem)
                                .plus(gasEstimates.totals.initialReporterRedeem);

      gasEstimates.totals.crowdsourcerForkAndRedeem = gasEstimates.totals.crowdsourcerForkAndRedeem.toString();
      gasEstimates.totals.initialReporterForkAndRedeem = gasEstimates.totals.initialReporterForkAndRedeem.toString();
      gasEstimates.totals.crowdsourcerRedeem = gasEstimates.totals.crowdsourcerRedeem.toString();
      gasEstimates.totals.initialReporterRedeem = gasEstimates.totals.initialReporterRedeem.toString();
      gasEstimates.totals.all =  gasEstimates.totals.all.toString();

      result = {
        gasEstimates: gasEstimates,
      };
    }
    if (failedTransactions.crowdsourcerForkAndRedeem.length > 0 ||
        failedTransactions.initialReporterForkAndRedeem.length > 0 ||
        failedTransactions.crowdsourcerRedeem > 0 ||
        failedTransactions.initialReporterRedeem > 0) {
      result.failedTransactions = failedTransactions;
      return p.onFailed(new Error("Not all transactions were successful.\n" + JSON.stringify(result)));
    }
    p.onSuccess(result);
  });
}

module.exports = claimReportingFeesForkedMarket;
