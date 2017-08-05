"use strict";

var BigNumber = require("bignumber.js");
var finalizeMarket = require("./finalize-market");
var api = require("../api");
var constants = require("../constants");
var noop = require("../utils/noop");

// { marketID, payoutNumerators, reporter }
function redeem(p) {
  api().Market.getReportingToken({
    tx: { to: p.marketID },
    payoutNumerators: p.payoutNumerators
  }, function (reportingTokenContractAddress) {
    api().ReportingToken.balanceOf({
      tx: { to: reportingTokenContractAddress },
      address: p.reporter
    }, function (reportingTokenBalance) {
      if (new BigNumber(reportingTokenBalance, 16).lt(constants.DUST_THRESHOLD)) { // TODO calculate DUST_THRESHOLD
        return p.onFailed("Gas cost to redeem reporting tokens is greater than the value of the tokens");
      }

      // On any token contract that is no longer attached to a market (happens when some other market in your reporting
      // window forks, causing your market to move branches).  Note: disavowed can be redeemed any time (regardless of
      // reporting window, market finalization, etc.)
      api().Market.isContainerForReportingToken({
        tx: { to: p.marketID },
        reportingToken: reportingTokenContractAddress
      }, function (isContainerForReportingToken) {
        var redeemPayload = {
          _signer: p._signer,
          tx: { to: reportingTokenContractAddress, send: true },
          reporter: p.reporter,
          onSent: p.onSent,
          onSuccess: p.onSuccess,
          onFailed: p.onFailed
        };
        if (!parseInt(isContainerForReportingToken, 16)) { // if disavowed
          api().ReportingToken.redeemDisavowedTokens(redeemPayload);
        } else {
          finalizeMarket({
            _signer: p.signer,
            marketID: p.marketID,
            onSent: noop,
            onSuccess: function (isFinalized) {
              if (isFinalized === false) return p.onFailed("Market not yet finalized");
              api().ReportingToken.getBranch({ tx: { to: reportingTokenContractAddress } }, function (branchContractAddress) {

                // On any token contract attached to a market that ended in a fork.
                // (Note: forked and winning both require the market to be finalized.)
                api().Branch.getForkingMarket({ tx: { to: branchContractAddress } }, function (forkingMarket) {
                  if (forkingMarket === p.marketID) {
                    api().ReportingToken.redeemForkedTokens(redeemPayload);
                  } else {

                    // Redeem winning reporting tokens.
                    api().Market.getFinalWinningReportingToken({ tx: { to: p.marketID } }, function (finalWinningReportingToken) {
                      if (finalWinningReportingToken !== reportingTokenContractAddress) {
                        return p.onFailed("No winning tokens to redeem");
                      }
                      api().ReportingToken.redeemWinningTokens(redeemPayload);
                    });
                  }
                });
              });
            },
            onFailed: p.onFailed
          });
        }
      });
    });
  });
}

module.exports = redeem;
