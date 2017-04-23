"use strict";

var getLogs = require("../logs/get-logs");
var isFunction = require("../utils/is-function");

function parseLastBlockNumber(logs) {
  return logs[logs.length - 1].blockNumber;
}

function getRegisterBlockNumber(account, callback) {
  var logs;
  if (!isFunction(callback)) {
    logs = getLogs("registration", { sender: account });
    if (!logs || !logs.length) return null;
    return parseLastBlockNumber(logs);
  }
  getLogs("registration", { sender: account }, function (err, logs) {
    if (err) return callback(err);
    if (!logs || !logs.length) return callback(null, null);
    callback(null, parseLastBlockNumber(logs));
  });
}

module.exports = getRegisterBlockNumber;
