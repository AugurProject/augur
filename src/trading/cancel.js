"use strict";

var abi = require("augur-abi");
var eventsAPI = require("augur-contracts").api.events;
var api = require("../api");
var compose = require("../utils/compose");
var isObject = require("../utils/is-object");
var rpcInterface = require("../rpc-interface");
var errors = rpcInterface.errors;

function cancel(trade_id, onSent, onSuccess, onFailed) {
  if (isObject(trade_id)) {
    onSent = trade_id.onSent;
    onSuccess = trade_id.onSuccess;
    onFailed = trade_id.onFailed;
    trade_id = trade_id.trade_id;
  }
  onSent = onSent || noop;
  onSuccess = onSuccess || noop;
  onFailed = onFailed || noop;
  api.BuyAndSellShares.cancel(trade_id, onSent, compose(function (result, callback) {
    if (!result || !result.callReturn) return callback(result);
    rpcInterface.getTransactionReceipt(result.hash, function (receipt) {
      var logs, sig, numLogs, logdata, i;
      if (!receipt) return onFailed(errors.TRANSACTION_RECEIPT_NOT_FOUND);
      if (receipt.error) return onFailed(receipt);
      if (receipt && Array.isArray(receipt.logs) && receipt.logs.length) {
        logs = receipt.logs;
        sig = eventsAPI.log_cancel.signature;
        result.cashRefund = "0";
        numLogs = logs.length;
        for (i = 0; i < numLogs; ++i) {
          if (logs[i].topics[0] === sig) {
            logdata = abi.unroll_array(logs[i].data);
            if (Array.isArray(logdata) && logdata.length) {
              result.cashRefund = abi.unfix(logdata[5], "string");
              break;
            }
          }
        }
      }
      callback(result);
    });
  }, onSuccess), onFailed);
}

module.exports = cancel;
