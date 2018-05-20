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
 * @typedef {Object} NonforkedMarket
 * @property {string} marketId Ethereum contract address of the non-Forked Market, as a hexadecimal string.
 * @property {string} universe Ethereum contract address of Universe to which the non-Forked Market belongs, as a hexadecimal string.
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
  for (i = 0; i < p.feeWindows.length; i++) {
    redeemableContracts.push({
      address: p.feeWindows[i],
      type: contractTypes.FEE_WINDOW,
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
        break;
      case contractTypes.INITIAL_REPORTER:
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
                                .plus(gasEstimates.totals.feeWindowRedeem)
                                .plus(gasEstimates.totals.crowdsourcerRedeem)
                                .plus(gasEstimates.totals.initialReporterRedeem);

      gasEstimates.totals.disavowCrowdsourcers = gasEstimates.totals.disavowCrowdsourcers.toString();
      gasEstimates.totals.feeWindowRedeem = gasEstimates.totals.feeWindowRedeem.toString();
      gasEstimates.totals.crowdsourcerRedeem = gasEstimates.totals.crowdsourcerRedeem.toString();
      gasEstimates.totals.initialReporterRedeem = gasEstimates.totals.initialReporterRedeem.toString();
      gasEstimates.totals.all =  gasEstimates.totals.all.toString();

      result = {
        gasEstimates: gasEstimates,
      };
    }
    if (failedTransactions.disavowCrowdsourcers.length > 0 ||
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
 * @param {Array.<string>} p.feeWindows Array of FeeWindow contract addresses which to claim reporting fees, as hexadecimal strings.
 * @param {Array.<NonforkedMarket>} p.nonforkedMarkets Array containing objects with information about the non-Forked Markets in which the user has unclaimed fees.
 * @param {boolean} p.estimateGas Whether to return gas estimates for the transactions instead of actually making the transactions.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called if/when the transactions are broadcast to the network. (Currently used as a placeholder and not actually used by this function.)
 * @param {function} p.onSuccess Called if/when all transactions are sealed and confirmed.
 * @param {function} p.onFailed Called if/when all transactions have been attempted and at least one transaction has failed. Error message shows which transactions succeeded and which ones failed.
 */
function claimReportingFeesNonforkedMarkets(p) {
  var payload = immutableDelete(p, ["redeemer", "feeWindows", "forkedMarket", "nonforkedMarkets", "estimateGas", "onSent", "onSuccess", "onFailed"]);
  var successfulTransactions = {
    disavowCrowdsourcers: [],
    feeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var failedTransactions = {
    disavowCrowdsourcers: [],
    feeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
  };
  var gasEstimates = {
    disavowCrowdsourcers: [],
    feeWindowRedeem: [],
    crowdsourcerRedeem: [],
    initialReporterRedeem: [],
    totals: {
      disavowCrowdsourcers: new BigNumber(0),
      feeWindowRedeem: new BigNumber(0),
      crowdsourcerRedeem: new BigNumber(0),
      initialReporterRedeem: new BigNumber(0),
      all: new BigNumber(0),
    },
  };

  if (p.forkedMarket) {
    async.eachLimit(p.nonforkedMarkets, PARALLEL_LIMIT, function (nonforkedMarket, nextNonforkedMarket) {
      if (nonforkedMarket.isFinalized || nonforkedMarket.crowdsourcersAreDisavowed) {
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

module.exports = claimReportingFeesNonforkedMarkets;
