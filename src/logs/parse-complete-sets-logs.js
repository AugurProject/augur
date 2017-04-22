"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var formatTradeType = require("../format/log/format-trade-type");

var ONE = new BigNumber("1", 10);

function parseCompleteSetsLogs(logs, mergeInto) {
  var i, j, n, marketID, logData, numOutcomes, logType, parsed;
  parsed = mergeInto || {};
  for (i = 0, n = logs.length; i < n; ++i) {
    if (logs[i] && logs[i].data != null && logs[i].data !== "0x") {
      marketID = logs[i].topics[2];
      logType = formatTradeType(logs[i].topics[3]);
      logData = abi.unroll_array(logs[i].data);
      numOutcomes = parseInt(logData[1], 16);
      if (mergeInto) {
        if (!parsed[marketID]) parsed[marketID] = {};
        for (j = 1; j <= numOutcomes; ++j) {
          if (!parsed[marketID][j]) parsed[marketID][j] = [];
          parsed[marketID][j].push({
            type: logType,
            isCompleteSet: true,
            amount: abi.unfix(logData[0], "string"),
            price: ONE.dividedBy(abi.bignum(numOutcomes)).toFixed(),
            blockNumber: parseInt(logs[i].blockNumber, 16)
          });
        }
      } else {
        if (!parsed[marketID]) parsed[marketID] = [];
        parsed[marketID].push({
          type: logType,
          amount: abi.unfix(logData[0], "string"),
          numOutcomes: numOutcomes,
          blockNumber: parseInt(logs[i].blockNumber, 16)
        });
      }
    }
  }
  return parsed;
}

module.exports = parseCompleteSetsLogs;
