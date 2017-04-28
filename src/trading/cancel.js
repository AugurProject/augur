"use strict";

var assign =require("lodash.assign");
var abi = require("augur-abi");
var eventsAPI = require("augur-contracts").api.events;
var api = require("../api");
var compose = require("../utils/compose");
var rpcInterface = require("../rpc-interface");
var errors = rpcInterface.errors;

// { trade_id, onSent, onSuccess, onFailed }
function cancel(p) {
  api().BuyAndSellShares.cancel(assign({}, p, {
    onSuccess: compose(function (result, callback) {
      if (!result || !result.callReturn) return callback(result);
      rpcInterface.getTransactionReceipt(result.hash, function (receipt) {
        var logs, sig, numLogs, logdata, i;
        if (!receipt) return p.onFailed(errors.TRANSACTION_RECEIPT_NOT_FOUND);
        if (receipt.error) return p.onFailed(receipt);
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
    }, p.onSuccess)
  }));
}

module.exports = cancel;
