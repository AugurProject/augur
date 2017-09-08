"use strict";

var api = require("../api");

// { branchID }
function registerToReport(p) {
  api().Branch.getNextReportingWindow({ tx: { to: p.branchID } }, function (nextReportingWindowAddress) {
    api().ReportingWindow.getRegistrationToken({ tx: { to: nextReportingWindowAddress } }, function (registrationTokenAddress) {
      api().RegistrationToken.register({
        _signer: p._signer,
        tx: { to: registrationTokenAddress, send: true },
        onSent: p.onSent,
        onSuccess: p.onSuccess,
        onFailed: p.onFailed
      });
    });
  });
}

module.exports = registerToReport;
