"use strict";

var api = require("../api");
var abiMap = require("../contracts").abi;
var getLogs = require("../logs/get-logs");
var parseLogMessage = require("../filters/parse-message/parse-log-message");

// { market, creationBlock }
function getLoggedMarketInfo(p, callback) {
  api().Market.getReportingWindow({ tx: { to: p.market } }, function (err, reportingWindowAddress) {
    if (err) return callback(err);
    var label = "CreateMarket";
    getLogs({
      label: label,
      filter: {
        fromBlock: p.creationBlock,
        toBlock: p.creationBlock,
        market: p.market,
        address: reportingWindowAddress
      }
    }, function (err, marketCreationLogs) {
      if (err) return callback(err);
      if (!Array.isArray(marketCreationLogs) || !marketCreationLogs.length) return callback(null);
      callback(null, parseLogMessage(label, marketCreationLogs[0], abiMap.events[label].inputs));
    });
  });
}

module.exports = getLoggedMarketInfo;
