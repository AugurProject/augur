"use strict";

var getLogs = require("../logs/get-logs");

function parseLastBlockNumber(logs) {
  return logs[logs.length - 1].blockNumber;
}

// { account }
function getRegisterBlockNumber(p, callback) {
  getLogs("registration", { sender: p.account }, function (err, logs) {
    if (err) return callback(err);
    if (!logs || !logs.length) return callback(null, null);
    callback(null, parseLastBlockNumber(logs));
  });
}

module.exports = getRegisterBlockNumber;
