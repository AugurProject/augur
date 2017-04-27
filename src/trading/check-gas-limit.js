"use strict";

var async = require("async");
var maxOrdersPerTrade = require("./max-orders-per-trade");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var errors = rpcInterface.errors;
var TRADE_GAS = require("../constants").TRADE_GAS;

function checkGasLimit(trade_ids, sender, callback) {
  var gas = 0;
  var count = { buy: 0, sell: 0 };
  var block = rpcInterface.getCurrentBlock();
  var checked_trade_ids = trade_ids.slice();
  async.forEachOfSeries(trade_ids, function (trade_id, i, next) {
    api().Trades.get_trade({ id: trade_id }, function (trade) {
      if (!trade || !trade.id) {
        checked_trade_ids.splice(checked_trade_ids.indexOf(trade_id), 1);
        if (!checked_trade_ids.length) {
          return callback(errors.TRADE_NOT_FOUND);
        }
        console.warn("[augur.js] checkGasLimit:", errors.TRADE_NOT_FOUND);
      } else if (trade.owner === sender) {
        checked_trade_ids.splice(checked_trade_ids.indexOf(trade_id), 1);
        if (!checked_trade_ids.length) {
          return callback({ error: "-5", message: errors.trade["-5"] });
        }
        console.warn("[augur.js] checkGasLimit:", errors.trade["-5"]);
      }
      ++count[trade.type];
      gas += TRADE_GAS[Number(Boolean(i))][trade.type];
      next();
    });
  }, function (e) {
    var type;
    if (e) return callback(e);
    if (gas <= parseInt(block.gasLimit, 16)) {
      return callback(null, checked_trade_ids);
    } else if (!count.buy || !count.sell) {
      type = (count.buy) ? "buy" : "sell";
      return callback(null, checked_trade_ids.slice(0, maxOrdersPerTrade(type, block.gasLimit)));
    }
    callback(errors.GAS_LIMIT_EXCEEDED);
  });
}

module.exports = checkGasLimit;
