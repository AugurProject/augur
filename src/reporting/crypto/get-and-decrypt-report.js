"use strict";

var parseAndDecryptReport = require("./parse-and-decrypt-report");
var api = require("../../api");
var isFunction = require("../../utils/is-function");
var isObject = require("../../utils/is-object");

function getAndDecryptReport(branch, expDateIndex, reporter, event, secret, callback) {
  if (isObject(branch)) {
    expDateIndex = branch.expDateIndex;
    reporter = branch.reporter;
    event = branch.event;
    secret = branch.secret;
    callback = callback || branch.callback;
    branch = branch.branch;
  }
  if (!isFunction(callback)) {
    return parseAndDecryptReport(api().ExpiringEvents.getEncryptedReport(branch, expDateIndex, reporter, event), secret);
  }
  api().ExpiringEvents.getEncryptedReport(branch, expDateIndex, reporter, event, function (result) {
    if (!result || result.error) return callback(result);
    callback(parseAndDecryptReport(result), secret);
  });
}

module.exports = getAndDecryptReport;
