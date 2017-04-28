"use strict";

var abi = require("augur-abi");
var eventsAPI = require("augur-contracts").api.events;
var ZERO = require("../../constants").ZERO;

function parseTradeReceipt(receipt) {
  var i, numLogs, sharesBought, cashFromTrade, tradingFees, logs, sig, logdata;
  sharesBought = ZERO;
  cashFromTrade = ZERO;
  tradingFees = ZERO;
  if (receipt && Array.isArray(receipt.logs) && receipt.logs.length) {
    logs = receipt.logs;
    sig = eventsAPI.log_fill_tx.signature;
    for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
      if (logs[i].topics[0] === sig) {
        logdata = abi.unroll_array(logs[i].data);
        if (Array.isArray(logdata) && logdata.length > 6) {
          tradingFees = tradingFees.plus(abi.unfix(logdata[6]));
          // buy (matched sell order)
          if (parseInt(logdata[0], 16) === 1) {
            sharesBought = sharesBought.plus(abi.unfix(logdata[2]));
          // sell (matched buy order)
          // cash received = price per share * shares sold
          } else {
            cashFromTrade = cashFromTrade.plus(abi.unfix_signed(logdata[8]).times(abi.unfix(logdata[2])));
          }
        }
      }
    }
  }
  return {
    sharesBought: sharesBought.toFixed(),
    cashFromTrade: cashFromTrade.toFixed(),
    tradingFees: tradingFees.toFixed()
  };
}

module.exports = parseTradeReceipt;
