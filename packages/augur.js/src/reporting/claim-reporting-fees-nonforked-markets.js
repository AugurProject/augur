"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var assign = require("lodash").assign;
var api = require("../api");
var contractTypes = require("../constants").CONTRACT_TYPE;
var PARALLEL_LIMIT = require("../constants").PARALLEL_LIMIT;

 /**
 * @typedef {Object} NonforkedMarket
 * @property {string} marketId Ethereum contract address of the non-Forked Market, as a hexadecimal string.
 * @property {boolean} crowdsourcersAreDisavowed Whether the non-Forked Market's DisputeCrowdsourcers have been disavowed (i.e., its `Market.disavowCrowdsourcers` function has been called successfully).
 * @property {boolean} isMigrated Whether the non-Forked Market has been migrated to the Child Universe of its original Universe (i.e., its `Market.isMigrated` function has been called successfully).
 * @property {boolean} isFinalized Whether the non-Forked Market has been Finalized (i.e., its `Market.finalize` function has been called successfully).
 * @property {Array.<string>} crowdsourcers Array of Ethereum contract addresses of the non-Forked Market's DisputeCrowdsourcers, as hexadecimal strings.
 * @property {string|null} initialReporter Ethereum contract address of the non-Forked Market's InitialReporter, as a hexadecimal string.
 */

var CROWDSOURCER_REDEEM_ESTIMATE = new BigNumber(500000, 10);

function redeemContractFees(p, payload, successfulTransactions, failedTransactions, gasEstimates) {
  var redeemableContracts = [];
  var i;
  for (i = 0; i < p.disputeWindows.length; i++) {
    redeemableContracts.push({
      address: p.disputeWindows[i],
      type: contractTypes.DISPUTE_WINDOW,
    });
  }
  for (i = 0; i < p.nonforkedMarkets.length; i++) {
    for (var j = 0; j < p.nonforkedMarkets[i].crowdsourcers.length; j++) {
      var crowdsourcerAddress = p.nonforkedMarkets[i].crowdsourcers[j];
      var marketWasDisavowed = successfulTransactions.disavowCrowdsourcers.indexOf(p.nonforkedMarkets[i].marketId) !== -1;
      if (p.estimateGas && marketWasDisavowed) {
        gasEstimates.crowdsourcerRedeem.push({address: crowdsourcerAddress, estimate: CROWDSOURCER_REDEEM_ESTIMATE});
        gasEstimates.totals.crowdsourcerRedeem = gasEstimates.totals.crowdsourcerRedeem.plus(CROWDSOURCER_REDEEM_ESTIMATE);
      } else {
        redeemableContracts.push({
          address: crowdsourcerAddress,
          type: contractTypes.DISPUTE_CROWDSOURCER,
        });
      }
    }
    if (p.forkedMarket) {
      if (p.nonforkedMarkets[i].isFinalized) {
        redeemableContracts.push({
          address: p.nonforkedMarkets[i].initialReporter,
          type: contractTypes.INITIAL_REPORTER,
        });
      }
    } else {
      redeemableContracts.push({
        address: p.nonforkedMarkets[i].initialReporter,
        type: contractTypes.INITIAL_REPORTER,
      });
    }
  }

  var limit = p.estimateGas ? PARALLEL_LIMIT : 1;
  async.eachLimit(redeemableContracts, limit, function (contract, nextContract) {
    switch (contract.type) {
      case contractTypes.DISPUTE_WINDOW:
        api().DisputeWindow.redeem(assign({}, payload, {
          _sender: p.redeemer,
          tx: {
            to: contract.address,
            estimateGas: p.estimateGas,
          },
          onSent: function () {
            if (!p.estimateGas) {
              nextContract();
            }
          },
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.disputeWindowRedeem.push({address: contract.address, estimate: result});
              gasEstimates.totals.disputeWindowRedeem = gasEstimates.totals.disputeWindowRedeem.plus(result);
            } else {
              successfulTransactions.disputeWindowRedeem.push(contract.address);
            }
            if (p.estimateGas) nextContract();
            // console.log("Redeemed disputeWindow", contract.address);
          },
          onFailed: function () {
            failedTransactions.disputeWindowRedeem.push(contract.address);
            // console.log("Failed to redeem disputeWindow", contract.address);
          },
        }));
        break;
      case contractTypes.DISPUTE_CROWDSOURCER:
        api().DisputeCrowdsourcer.redeem(assign({}, payload, {
          _redeemer: p.redeemer,
          tx: {
            to: contract.address,
            estimateGas: p.estimateGas,
          },
          onSent: function () {
            if (!p.estimateGas) {
              nextContract();
            }
          },
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.crowdsourcerRedeem.push({address: contract.address, estimate: result});
              gasEstimates.totals.crowdsourcerRedeem = gasEstimates.totals.crowdsourcerRedeem.plus(result);
            } else {
              successfulTransactions.crowdsourcerRedeem.push(contract.address);
            }
            if (p.estimateGas) nextContract();
            // console.log("Redeemed crowdsourcer", contract.address);
          },
          onFailed: function () {
            failedTransactions.crowdsourcerRedeem.push(contract.address);
            // console.log("Failed to redeem crowdsourcer", contract.address);
          },
        }));
        break;
      case contractTypes.INITIAL_REPORTER:
        api().InitialReporter.redeem(assign({}, payload, {
          "": p.redeemer,
          tx: {
            to: contract.address,
            estimateGas: p.estimateGas,
          },
          onSent: function () {
            if (!p.estimateGas) {
              nextContract();
            }
          },
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.initialReporterRedeem.push({address: contract.address, estimate: result});
              gasEstimates.totals.initialReporterRedeem = gasEstimates.totals.initialReporterRedeem.plus(result);
            } else {
              successfulTransactions.initialReporterRedeem.push(contract.address);
            }
            if (p.estimateGas) nextContract();
            // console.log("Redeemed initialReporter", contract.address);
          },
          onFailed: function () {
            failedTransactions.initialReporterRedeem.push(contract.address);
            // console.log("Failed to redeem initialReporter", contract.address);
          },
        }));
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
                                .plus(gasEstimates.totals.disputeWindowRedeem)
                                .plus(gasEstimates.totals.crowdsourcerRedeem)
                                .plus(gasEstimates.totals.initialReporterRedeem);

      gasEstimates.totals.disavowCrowdsourcers = gasEstimates.totals.disavowCrowdsourcers.toString();
      gasEstimates.totals.disputeWindowRedeem = gasEstimates.totals.disputeWindowRedeem.toString();
      gasEstimates.totals.crowdsourcerRedeem = gasEstimates.totals.crowdsourcerRedeem.toString();
      gasEstimates.totals.initialReporterRedeem = gasEstimates.totals.initialReporterRedeem.toString();
      gasEstimates.totals.all =  gasEstimates.totals.all.toString();

      result = {
        gasEstimates: gasEstimates,
      };
    }
    if (failedTransactions.disavowCrowdsourcers.length > 0 ||
        failedTransactions.disputeWindowRedeem.length > 0 ||
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
 *   Call `DisputeWindow.redeem` on all fee windows in the current universe where the user has unclaimed participation tokens
 *   For reporting participants of non-forked markets:
 *     Call `DisputeCrowdsourcer.redeem`
 *     For initial reporters belonging to non-forked markets:
 *       If a forked market exists in the current universe:
 *         If the initial reporter belongs to a finalized market:
 *           Call `InitialReporter.redeem`
 *       Else:
 *         Call `InitialReporter.redeem`
 *
 * @param {Object} p Parameters object.
 * @param {string} p.redeemer Ethereum address attempting to redeem reporting fees, as a hexadecimal string.
 * @param {Array.<string>} p.disputeWindows Array of DisputeWindow contract addresses which to claim reporting fees, as hexadecimal strings.
 * @param {Array.<NonforkedMarket>} p.nonforkedMarkets Array containing objects with information about the non-Forked Markets in which the user has unclaimed fees.
 * @param {boolean} p.estimateGas Whether to return gas estimates for the transactions instead of actually making the transactions.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transactions are broadcast to the network. (Currently used as a placeholder and not actually used by this function.)
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when all transactions have been attempted and at least one transaction has failed. Error message shows which transactions succeeded and which ones failed.
 */
function claimReportingFeesNonforkedMarkets(p) {
  var payload = immutableDelete(p, ["redeemer", "disputeWindows", "forkedMarket", "nonforkedMarkets", "estimateGas", "onSent", "onSuccess", "onFailed"]);
  var successfulTransactions = {
    disavowCrowdsourcers: [],
    disputeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var failedTransactions = {
    disavowCrowdsourcers: [],
    disputeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var gasEstimates = {
    disavowCrowdsourcers: [],
    disputeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
    totals: {
      disavowCrowdsourcers: new BigNumber(0),
      disputeWindowRedeem: new BigNumber(0),
      crowdsourcerRedeem: new BigNumber(0),
      initialReporterRedeem: new BigNumber(0),
      all: new BigNumber(0),
    },
  };

  if (p.forkedMarket) {
    var limit = p.estimateGas ? PARALLEL_LIMIT : 1;
    async.eachLimit(p.nonforkedMarkets, limit, function (nonforkedMarket, nextNonforkedMarket) {
      if (nonforkedMarket.isFinalized || nonforkedMarket.crowdsourcersAreDisavowed) {
        nextNonforkedMarket();
      } else {
        api().Market.disavowCrowdsourcers(assign({}, payload, {
          tx: {
            to: nonforkedMarket.marketId,
            estimateGas: p.estimateGas,
          },
          onSent: function () {
            if (!p.estimateGas) {
              nextNonforkedMarket();
            }
          },
          onSuccess: function (result) {
            if (p.estimateGas) {
              result = new BigNumber(result, 16);
              gasEstimates.disavowCrowdsourcers.push({address: nonforkedMarket.marketId, estimate: result});
              gasEstimates.totals.disavowCrowdsourcers = gasEstimates.totals.disavowCrowdsourcers.plus(result);
            }
            successfulTransactions.disavowCrowdsourcers.push(nonforkedMarket.marketId);
            if (p.estimateGas) nextNonforkedMarket();
            // console.log("Disavowed crowdsourcers for market", nonforkedMarket.marketId);
          },
          onFailed: function () {
            failedTransactions.disavowCrowdsourcers.push(nonforkedMarket.marketId);
            // console.log("Failed to disavow crowdsourcers for", nonforkedMarket.marketId);
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

module.exports = claimReportingFeesNonforkedMarkets;
