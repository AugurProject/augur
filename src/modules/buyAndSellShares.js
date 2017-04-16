"use strict";

var abi = require("augur-abi");
var noop = require("../utils/noop");
var compose = require("../utils/compose");
var constants = require("../constants");
var store = require("../store");

module.exports = {

  cancel: function (trade_id, onSent, onSuccess, onFailed) {
    var self = this;
    if (this.options.debug.trading) {
      console.log("cancel:", JSON.stringify(trade_id, null, 2));
    }
    if (trade_id && trade_id.constructor === Object) {
      onSent = trade_id.onSent;
      onSuccess = trade_id.onSuccess;
      onFailed = trade_id.onFailed;
      trade_id = trade_id.trade_id;
    }
    onSent = onSent || noop;
    onSuccess = onSuccess || noop;
    onFailed = onFailed || noop;
    this.BuyAndSellShares.cancel(trade_id, onSent, compose(function (result, cb) {
      if (!result || !result.callReturn) return cb(result);
      self.rpc.getTransactionReceipt(result.hash, function (receipt) {
        var logs, sig, numLogs, logdata, i;
        if (!receipt) return onFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
        if (receipt.error) return onFailed(receipt);
        if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
          logs = receipt.logs;
          sig = store.getState().contractsAPI.events.log_cancel.signature;
          result.cashRefund = "0";
          numLogs = logs.length;
          for (i = 0; i < numLogs; ++i) {
            if (logs[i].topics[0] === sig) {
              logdata = abi.unroll_array(logs[i].data);
              if (logdata && logdata.constructor === Array && logdata.length) {
                result.cashRefund = abi.unfix(logdata[5], "string");
                break;
              }
            }
          }
        }
        cb(result);
      });
    }, onSuccess), onFailed);
  },

  buy: function (amount, price, market, outcome, tradeGroupID, scalarMinMax, onSent, onSuccess, onFailed) {
    if (this.options.debug.trading) {
      console.log("buy:", JSON.stringify(amount, null, 2));
    }
    if (amount !== undefined && amount !== null && amount.constructor === Object) {
      price = amount.price;
      market = amount.market;
      outcome = amount.outcome;
      tradeGroupID = amount.tradeGroupID;
      scalarMinMax = amount.scalarMinMax;
      onSent = amount.onSent;
      onSuccess = amount.onSuccess;
      onFailed = amount.onFailed;
      amount = amount.amount;
    }
    if (scalarMinMax && scalarMinMax.minValue !== undefined) {
      price = this.shrinkScalarPrice(scalarMinMax.minValue, price);
    }
    return this.BuyAndSellShares.buy(abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome, abi.fix(constants.MINIMUM_TRADE_SIZE, "hex"), tradeGroupID || 0, onSent, onSuccess, onFailed);
  },

  sell: function (amount, price, market, outcome, tradeGroupID, scalarMinMax, onSent, onSuccess, onFailed) {
    if (this.options.debug.trading) {
      console.log("sell:", JSON.stringify(amount, null, 2));
    }
    if (amount !== undefined && amount !== null && amount.constructor === Object) {
      price = amount.price;
      market = amount.market;
      outcome = amount.outcome;
      tradeGroupID = amount.tradeGroupID;
      scalarMinMax = amount.scalarMinMax;
      onSent = amount.onSent;
      onSuccess = amount.onSuccess;
      onFailed = amount.onFailed;
      amount = amount.amount;
    }
    if (scalarMinMax && scalarMinMax.minValue !== undefined) {
      price = this.shrinkScalarPrice(scalarMinMax.minValue, price);
    }
    return this.BuyAndSellShares.sell(abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome, abi.fix(constants.MINIMUM_TRADE_SIZE, "hex"), 0, tradeGroupID || 0, onSent, onSuccess, onFailed);
  },

  shortAsk: function (amount, price, market, outcome, tradeGroupID, scalarMinMax, onSent, onSuccess, onFailed) {
    if (this.options.debug.trading) {
      console.log("shortAsk:", JSON.stringify(amount, null, 2));
    }
    if (amount !== undefined && amount !== null && amount.constructor === Object) {
      price = amount.price;
      market = amount.market;
      outcome = amount.outcome;
      tradeGroupID = amount.tradeGroupID;
      scalarMinMax = amount.scalarMinMax;
      onSent = amount.onSent;
      onSuccess = amount.onSuccess;
      onFailed = amount.onFailed;
      amount = amount.amount;
    }
    if (scalarMinMax && scalarMinMax.minValue !== undefined) {
      price = this.shrinkScalarPrice(scalarMinMax.minValue, price);
    }
    return this.BuyAndSellShares.shortAsk(abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome, abi.fix(constants.MINIMUM_TRADE_SIZE, "hex"), tradeGroupID || 0, onSent, onSuccess, onFailed);
  }
};
