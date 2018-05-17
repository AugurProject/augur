"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var assign = require("lodash").assign;
var api = require("../api");
var contractTypes = require("../constants").CONTRACT_TYPE;
var PARALLEL_LIMIT = require("../constants").PARALLEL_LIMIT;

/**
 * @typedef {Object} ForkedMarket
 * @property {string} address Ethereum contract address of the Forked Market, as a hexadecimal string.
 * @property {string} universeAddress Ethereum contract address of Universe to which the Forked Market belongs, as a hexadecimal string.
 * @property {boolen} isFinalized Whether the Forked Market has been Finalized (i.e., the function Market.finalize` has been called on it successfully).
 * @property {Array.<CrowdsourcerState>} crowdsourcers Array of objects containing information about the Forked Market’s DisputeCrowdsourcers.
 * @property {InitialReporterState|null} initialReporter Object containing information about the Forked Market’s InitialReporter.
 */

/**
 * @typedef {Object} CrowdsourcerState
 * @property {string} crowdsourcerId Ethereum contract address of a DisputeCrowdsourcer belonging to a Forked Market, as a hexadecimal string.
 * @property {boolean} isForked Whether the DisputeCrowdsourcer has been forked (i.e., has had its DisputeCrowdsourcer.fork function called successfully).
 * @property {BigNumber} unclaimedRepStaked Amount of unclaimed REP the user has staked in the DisputeCrowdsourcer.
 */

/**
 * @typedef {Object} InitialReporterState
 * @property {string} initialReporterId Ethereum contract address of the InitialReporter belonging to a Forked Market, as a hexadecimal string.
 * @property {boolean} isForked Whether the InitialReporter has been forked (i.e., has had its InitialReporter.fork function called successfully).
 * @property {BigNumber} unclaimedRepStaked Amount of unclaimed REP the user has staked in the IntialReporter.
 */

 /**
 * @typedef {Object} NonforkedMarket
 * @property {string} marketId Ethereum contract address of the non-Forked Market, as a hexadecimal string.
 * @property {string} universe Ethereum contract address of Universe to which the non-Forked Market belongs, as a hexadecimal string.
 * @property {boolean} crowdsourcersAreDisavowed Whether the non-Forked Market's DisputeCrowdsourcers have been disavowed (i.e., its `Market.disavowCrowdsourcers` function has been called successfully).
 * @property {boolean} isMigrated Whether the non-Forked Market has been migrated to the Child Universe of its original Universe (i.e., its `Market.isMigrated` function has been called successfully).
 * @property {boolean} isFinalized Whether the non-Forked Market has been Finalized (i.e., its `Market.finalize` function has been called successfully).
 * @property {Array.<string>} crowdsourcers Array of Ethereum contract addresses of the non-Forked Market's DisputeCrowdsourcers, as hexadecimal strings.
 * @property {string|null} initialReporter Ethereum contract address of the non-Forked Market's InitialReporter, as a hexadecimal string.
 */

function redeemContractFees(p, payload, successfulTransactions, failedTransactions, gasEstimates) {
  var redeemableContracts = [];
  var i;
  for (i = 0; i < p.feeWindows.length; i++) {
    redeemableContracts.push({
      address: p.feeWindows[i],
      type: contractTypes.FEE_WINDOW,
    });
  }
  if (p.forkedMarket) {
    if (p.forkedMarket.crowdsourcers) {
      for (i = 0; i < p.forkedMarket.crowdsourcers.length; i++) {
        redeemableContracts.push({
          address: p.forkedMarket.crowdsourcers[i].crowdsourcerId,
          isForked: p.forkedMarket.crowdsourcers[i].isForked,
          marketIsForked: true,
          type: contractTypes.DISPUTE_CROWDSOURCER,
        });
      }
    }
    if (p.forkedMarket.initialReporter && p.forkedMarket.initialReporter.initialReporterId) {
      redeemableContracts.push({
        address: p.forkedMarket.initialReporter.initialReporterId,
        isForked: p.forkedMarket.initialReporter.isForked,
        marketIsForked: true,
        type: contractTypes.INITIAL_REPORTER,
      });
    }
  }
  for (i = 0; i < p.nonforkedMarkets.length; i++) {
    for (var j = 0; j < p.nonforkedMarkets[i].crowdsourcers.length; j++) {
      redeemableContracts.push({
        address: p.nonforkedMarkets[i].crowdsourcers[j],
        isFinalized: p.nonforkedMarkets[i].isFinalized,
        marketIsForked: false,
        type: contractTypes.DISPUTE_CROWDSOURCER,
      });
    }
    redeemableContracts.push({
      address: p.nonforkedMarkets[i].initialReporter,
      isFinalized: p.nonforkedMarkets[i].isFinalized,
      marketIsForked: false,
      type: contractTypes.INITIAL_REPORTER,
    });
  }

  async.eachLimit(redeemableContracts, PARALLEL_LIMIT, function (contract, nextContract) {
    switch (contract.type) {
      case contractTypes.FEE_WINDOW:
        api().FeeWindow.redeem(assign({}, payload, {
          _sender: p.redeemer,
          tx: {
            to: contract.address,
            estimateGas: p.estimateGas,
          },
          onSent: function () {},
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.feeWindowRedeem.push({address: contract.address, estimate: result});
              gasEstimates.totals.feeWindowRedeem = gasEstimates.totals.feeWindowRedeem.plus(result);
            } else {
              successfulTransactions.feeWindowRedeem.push(contract.address);
            }
            // console.log("Redeemed feeWindow", contract.address);
            nextContract();
          },
          onFailed: function () {
            failedTransactions.feeWindowRedeem.push(contract.address);
            // console.log("Failed to redeem feeWindow", contract.address);
            nextContract();
          },
        }));
        break;
      case contractTypes.DISPUTE_CROWDSOURCER:
        if (contract.marketIsForked && !contract.isForked) {
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
        if (contract.marketIsForked && !contract.isForked) {
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
      gasEstimates.totals.all = gasEstimates.totals.disavowCrowdsourcers
                                .plus(gasEstimates.totals.crowdsourcerForkAndRedeem)
                                .plus(gasEstimates.totals.initialReporterForkAndRedeem)
                                .plus(gasEstimates.totals.feeWindowRedeem)
                                .plus(gasEstimates.totals.crowdsourcerRedeem)
                                .plus(gasEstimates.totals.initialReporterRedeem);
      result = {
        gasEstimates: gasEstimates,
      };
    }
    if (failedTransactions.disavowCrowdsourcers.length > 0 ||
        failedTransactions.crowdsourcerForkAndRedeem.length > 0 ||
        failedTransactions.initialReporterForkAndRedeem.length > 0 ||
        failedTransactions.feeWindowRedeem.length > 0 ||
        failedTransactions.crowdsourcerRedeem > 0 ||
        failedTransactions.initialReporterRedeem > 0) {
      result.failedTransactions = failedTransactions;
      return p.onFailed(new Error("Not all transactions were successful.\n" + JSON.stringify(result)));
    }
    p.onSuccess(result);
  });
}

/**
 * Claims all reporting fees for a user as follows:
 *
 * If a forked market exists in the current universe:
 *   For all non-finalized markets in current universe where the user has unclaimed fees in the reporting participants:
 *     Call `Market.disavowCrowdsourcers`
 *
 * Once the above has been completed:
 *   Call `FeeWindow.redeem` on all fee windows in the current universe where the user has unclaimed participation tokens
 *   For each reporting participant of the forked market in which the user has unclaimed fees:
 *     If `DisputeCrowdsourcer.fork`/`InitialReporter.fork` has not been called:
 *       Call `DisputeCrowdsourcer.forkAndRedeem`/`InitialReporter.forkAndRedeem`
 *     Else:
 *       Call `DisputeCrowdsourcer.redeem`/`InitialReporter.redeem`
 *   For all other reporting participants:
 *     Call `DisputeCrowdsourcer.redeem`/`InitialReporter.redeem`
 *
 * @param {Object} p Parameters object.
 * @param {string} p.redeemer Ethereum address attempting to redeem reporting fees, as a hexadecimal string.
 * @param {Array.<string>} p.feeWindows Array of FeeWindow contract addresses which to claim reporting fees, as hexadecimal strings.
 * @param {ForkedMarket} p.forkedMarket Object containing information about the Forked Market in which the user has unclaimed fees in the Parent Universe(if there is one).
 * @param {Array.<NonforkedMarket>} p.nonforkedMarkets Array containing objects with information about the non-Forked Markets in which the user has unclaimed fees.
 * @param {boolean} p.estimateGas Whether to return gas estimates for the transactions instead of actually making the transactions.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transactions are broadcast to the network. (Currently used as a placeholder and not actually used by this function.)
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when all transactions have been attempted and at least one transaction has failed. Error message shows which transactions succeeded and which ones failed.
 */
function claimReportingFees(p) {
  var payload = immutableDelete(p, ["redeemer", "feeWindows", "forkedMarket", "nonforkedMarkets", "estimateGas", "onSent", "onSuccess", "onFailed"]);
  var successfulTransactions = {
    disavowCrowdsourcers: [],
    crowdsourcerForkAndRedeem: [],
    initialReporterForkAndRedeem: [],
    feeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var failedTransactions = {
    disavowCrowdsourcers: [],
    crowdsourcerForkAndRedeem: [],
    initialReporterForkAndRedeem: [],
    feeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var gasEstimates = {
    disavowCrowdsourcers: [],
    crowdsourcerForkAndRedeem: [],
    initialReporterForkAndRedeem: [],
    feeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
    totals: {
      disavowCrowdsourcers: new BigNumber(0),
      crowdsourcerForkAndRedeem: new BigNumber(0),
      initialReporterForkAndRedeem: new BigNumber(0),
      feeWindowRedeem: new BigNumber(0),
      crowdsourcerRedeem: new BigNumber(0),
      initialReporterRedeem: new BigNumber(0),
      all: new BigNumber(0),
    },
  };

  if (p.forkedMarket) {
    async.eachLimit(p.nonforkedMarkets, PARALLEL_LIMIT, function (nonforkedMarket, nextNonforkedMarket) {
      if (nonforkedMarket.isFinalized) {
        nextNonforkedMarket();
      } else {
        api().Market.disavowCrowdsourcers(assign({}, payload, {
          tx: {
            to: nonforkedMarket.marketId,
            estimateGas: p.estimateGas,
          },
          onSent: function () {},
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.disavowCrowdsourcers.push({address: nonforkedMarket.marketId, estimate: result});
              gasEstimates.totals.disavowCrowdsourcers = gasEstimates.totals.disavowCrowdsourcers.plus(result);
            }
            successfulTransactions.disavowCrowdsourcers.push(nonforkedMarket.marketId);
            // console.log("Disavowed crowdsourcers for market", nonforkedMarket.marketId);
            nextNonforkedMarket();
          },
          onFailed: function () {
            failedTransactions.disavowCrowdsourcers.push(nonforkedMarket.marketId);
            // console.log("Failed to disavow crowdsourcers for", nonforkedMarket.marketId);
            nextNonforkedMarket();
          },
        }));
      }
    }, function () {
      redeemContractFees(p, payload, successfulTransactions, failedTransactions, gasEstimates);
    });
  } else {
    redeemContractFees(p, payload, successfulTransactions, failedTransactions, gasEstimates);
  }
}

module.exports = claimReportingFees;
