"use strict";

var parseAndDecryptReport = require("./parse-and-decrypt-report");
var api = require("../../api");
var isFunction = require("../../utils/is-function");
var isObject = require("../../utils/is-object");

// { branch, expDateIndex, reporter, event, secret }
function getAndDecryptReport(p, callback) {
  if (!isFunction(callback)) {
    return parseAndDecryptReport(api().ExpiringEvents.getEncryptedReport({
      branch: p.branch,
      expDateIndex: p.expDateIndex,
      reporter: p.reporter,
      event: p.event
    }), p.secret);
  }
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
