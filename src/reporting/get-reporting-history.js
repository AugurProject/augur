"use strict";

var augurNode = require("../augur-node");

/**
 * @param {Object} p Parameters object.
 * @param {string=} p.reporter Look up reports submitted by this Ethereum address.
 * @param {string=} p.market Look up reports submitted on this market.
 * @param {string=} p.branch Look up reports submitted on markets within this branch.
 * @param {function} callback Called when reporting history has been received and parsed.
 * @return {Object} Reporting history, keyed by market ID.
 */
function getReportingHistory(p, callback) {
  augurNode.submitRequest("getReportingHistory", p, callback);
  // getLogsChunked({ label: "SubmitReport", filter: p, aux: { index: "market" } }, noop, function (err, submitReportLogs) {
  //   if (err) return callback(err);
  //   var markets = Object.keys(submitReportLogs);
  //   async.eachSeries(markets, function (market, nextMarket) {
  //     api().Market.getFinalWinningReportingToken({ tx: { to: market } }, function (err, finalWinningReportingToken) {
  //       if (err) return nextMarket(err);
  //       if (parseInt(finalWinningReportingToken, 16) === 0) return nextMarket(null, submitReportLogs);
  //       async.parallel({
  //         redeemWinningTokens: function (next) {
  //           getLogsChunked({ label: "RedeemWinningTokens", filter: assign({}, p, { market: market }) }, noop, function (err, redeemWinningTokensLogs) {
  //             if (err) return next(err);
  //             next(null, redeemWinningTokensLogs.reduce(function (acc, redeemWinningTokensLog) {
  //               return {
  //                 amountRedeemed: acc.amountRedeemed.plus(new BigNumber(redeemWinningTokensLog.amountRedeemed, 10)),
  //                 reportingFeesReceived: acc.reportingFeesReceived.plus(new BigNumber(redeemWinningTokensLog.reportingFeesReceived, 10))
  //               };
  //             }, { amountRedeemed: ZERO, reportingFeesReceived: ZERO }));
  //           });
  //         },
  //         finalizationTime: function (next) {
  //           api().Market.getFinalizationTime({ tx: { to: market } }, function (err, finalizationTime) {
  //             if (err) return next(err);
  //             next(null, parseInt(finalizationTime, 16));
  //           });
  //         },
  //         winningPayoutNumerators: function (next) {
  //           api().ReportingToken.getPayoutNumerators({ tx: { to: finalWinningReportingToken } }, function (err, winningPayoutNumerators) {
  //             if (err) return next(err);
  //             next(null, winningPayoutNumerators.map(function (payoutNumerator) {
  //               return new BigNumber(payoutNumerator, 16).toFixed();
  //             }));
  //           });
  //         }
  //       }, function (err, data) {
  //         if (err) return nextMarket(err);
  //         for (var i = 0, numLogs = submitReportLogs[market].length; i < numLogs; ++i) {
  //           assign(submitReportLogs[market][i], {
  //             winningPayoutNumerators: data.winningPayoutNumerators,
  //             isReportCorrect: isEqual(submitReportLogs[market][i].payoutNumerators, data.winningPayoutNumerators),
  //             finalWinningReportingToken: finalWinningReportingToken,
  //             finalizationTime: data.finalizationTime,
  //             amountRedeemed: data.redeemWinningTokens.amountRedeemed.toFixed(),
  //             reportingFeesReceived: data.redeemWinningTokens.reportingFeesReceived.toFixed()
  //           });
  //         }
  //         nextMarket();
  //       });
  //     });
  //   }, function (err) {
  //     if (err) return callback(err);
  //     callback(null, submitReportLogs);
  //   });
  // });
}

module.exports = getReportingHistory;
