"use strict";

var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.branchID Branch on which to register to report.
 * @param {buffer|function=} p._signer Can be the plaintext private key as a Buffer or the signing function to use.
 * @param {function} p.onSent Called if/when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if/when the transaction completes successfully.
 * @param {function} p.onFailed Called if/when the transaction fails.
 */
function registerToReport(p) {
  api().Branch.getNextReportingWindow({ tx: { to: p.branchID } }, function (err, nextReportingWindowAddress) {
    if (err) return p.onFailed(err);
    api().ReportingWindow.getRegistrationToken({ tx: { to: nextReportingWindowAddress } }, function (err, registrationTokenAddress) {
      if (err) return p.onFailed(err);
      api().RegistrationToken.register({
        _signer: p._signer,
        tx: { to: registrationTokenAddress },
        onSent: p.onSent,
        onSuccess: p.onSuccess,
        onFailed: p.onFailed
      });
    });
  });
}

module.exports = registerToReport;
