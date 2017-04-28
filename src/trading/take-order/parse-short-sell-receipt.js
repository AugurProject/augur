"use strict";

var abi = require("augur-abi");
var eventsAPI = require("augur-contracts").api.events;
var ZERO = require("../../constants").ZERO;

function parseShortSellReceipt(receipt) {
  var i, numLogs, cashFromTrade, tradingFees, logs, sig, logdata;
  cashFromTrade = ZERO;
  tradingFees = ZERO;
  if (receipt && Array.isArray(receipt.logs) && receipt.logs.length) {
    logs = receipt.logs;
    sig = eventsAPI.log_short_fill_tx.signature;
    for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
      if (logs[i].topics[0] === sig) {
        logdata = abi.unroll_array(logs[i].data);
        if (logdata && Array.isArray(logdata) && logdata.length > 8) {
          cashFromTrade = cashFromTrade.plus(abi.unfix_signed(logdata[8]).times(abi.unfix(logdata[1])));
          tradingFees = tradingFees.plus(abi.unfix(logdata[5]));
        }
      }
    }
  }
  return {
    cashFromTrade: cashFromTrade.toFixed(),
    tradingFees: tradingFees.toFixed()
  };
}

module.exports = parseShortSellReceipt;
