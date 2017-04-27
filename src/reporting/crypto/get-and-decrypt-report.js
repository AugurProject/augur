"use strict";

var parseAndDecryptReport = require("./parse-and-decrypt-report");
var api = require("../../api");

// { branch, expDateIndex, reporter, event, secret }
function getAndDecryptReport(p, callback) {
  api().ExpiringEvents.getEncryptedReport({
    branch: p.branch,
    expDateIndex: p.expDateIndex,
    reporter: p.reporter,
    event: p.event
  }, function (result) {
    if (!result || result.error) return callback(result);
    callback(parseAndDecryptReport(result), p.secret);
  });
}

module.exports = getAndDecryptReport;
