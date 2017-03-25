"use strict";

var clone = require("clone");
var async = require("async");
var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");
var abacus = require("./abacus");

module.exports = {

  checkGasLimit: function (trade_ids, sender, callback) {
    var self = this;
    var gas = 0;
    var count = {buy: 0, sell: 0};
    var block = this.rpc.block;
    var checked_trade_ids = trade_ids.slice();
    async.forEachOfSeries(trade_ids, function (trade_id, i, next) {
      self.get_trade(trade_id, function (trade) {
        if (!trade || !trade.id) {
          checked_trade_ids.splice(checked_trade_ids.indexOf(trade_id), 1);
          if (!checked_trade_ids.length) {
            return callback(self.errors.TRADE_NOT_FOUND);
          }
          console.warn("[augur.js] checkGasLimit:", self.errors.TRADE_NOT_FOUND);
        } else if (trade.owner === sender) {
          checked_trade_ids.splice(checked_trade_ids.indexOf(trade_id), 1);
          if (!checked_trade_ids.length) {
            return callback({error: "-5", message: self.errors.trade["-5"]});
          }
          console.warn("[augur.js] checkGasLimit:", self.errors.trade["-5"]);
        }
        ++count[trade.type];
        gas += constants.TRADE_GAS[Number(Boolean(i))][trade.type];
        next();
      });
    }, function (e) {
      var type;
      if (e) return callback(e);
      if (gas <= parseInt(block.gasLimit, 16)) {
        return callback(null, checked_trade_ids);
      } else if (!count.buy || !count.sell) {
        type = (count.buy) ? "buy" : "sell";
        return callback(null, checked_trade_ids.slice(0, abacus.maxOrdersPerTrade(type, block.gasLimit)));
      }
      callback(self.errors.GAS_LIMIT_EXCEEDED);
    });
  },

  parseTradeReceipt: function (receipt) {
    var i, numLogs, sharesBought, cashFromTrade, tradingFees, logs, sig, logdata;
    sharesBought = constants.ZERO;
    cashFromTrade = constants.ZERO;
    tradingFees = constants.ZERO;
    if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
      logs = receipt.logs;
      sig = this.api.events.log_fill_tx.signature;
      for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
        if (logs[i].topics[0] === sig) {
          logdata = this.rpc.unmarshal(logs[i].data);
          if (logdata && logdata.constructor === Array && logdata.length > 6) {
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
  },

  parseShortSellReceipt: function (receipt) {
    var i, numLogs, cashFromTrade, tradingFees, logs, sig, logdata;
    cashFromTrade = constants.ZERO;
    tradingFees = constants.ZERO;
    if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
      logs = receipt.logs;
      sig = this.api.events.log_short_fill_tx.signature;
      for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
        if (logs[i].topics[0] === sig) {
          logdata = this.rpc.unmarshal(logs[i].data);
          if (logdata && logdata.constructor === Array && logdata.length > 8) {
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
  },

  trade: function (max_value, max_amount, trade_ids, tradeGroupID, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
    var self = this;
    if (this.options.debug.trading) {
      console.log("trade:", JSON.stringify(max_value, null, 2));
    }
    if (max_value.constructor === Object) {
      max_amount = max_value.max_amount;
      trade_ids = max_value.trade_ids;
      tradeGroupID = max_value.tradeGroupID;
      sender = max_value.sender;
      onTradeHash = max_value.onTradeHash;
      onCommitSent = max_value.onCommitSent;
      onCommitSuccess = max_value.onCommitSuccess;
      onCommitFailed = max_value.onCommitFailed;
      onNextBlock = max_value.onNextBlock;
      onTradeSent = max_value.onTradeSent;
      onTradeSuccess = max_value.onTradeSuccess;
      onTradeFailed = max_value.onTradeFailed;
      max_value = max_value.max_value;
    }
    onTradeHash = onTradeHash || utils.noop;
    onCommitSent = onCommitSent || utils.noop;
    onCommitSuccess = onCommitSuccess || utils.noop;
    onCommitFailed = onCommitFailed || utils.noop;
    onNextBlock = onNextBlock || utils.noop;
    onTradeSent = onTradeSent || utils.noop;
    onTradeSuccess = onTradeSuccess || utils.noop;
    onTradeFailed = onTradeFailed || utils.noop;
    this.checkGasLimit(trade_ids, abi.format_address(sender || this.from), function (err, trade_ids) {
      var bn_max_value, tradeHash;
      if (self.options.debug.trading) console.log("checkGasLimit:", err, trade_ids);
      if (err) return onTradeFailed(err);
      bn_max_value = abi.bignum(max_value);
      if (bn_max_value.gt(constants.ZERO) && bn_max_value.lt(constants.MINIMUM_TRADE_SIZE)) {
        return onTradeFailed({error: "-4", message: self.errors.trade["-4"]});
      }
      tradeHash = self.makeTradeHash(max_value, max_amount, trade_ids);
      if (self.options.debug.trading) console.log("tradeHash:", tradeHash);
      onTradeHash(tradeHash);
      self.commitTrade({
        hash: tradeHash,
        onSent: onCommitSent,
        onSuccess: function (res) {
          if (self.options.debug.trading) console.log("commitTrade:", res);
          onCommitSuccess(res);
          self.rpc.fastforward(1, function (blockNumber) {
            var tx;
            if (self.options.debug.trading) console.log("fastforward:", blockNumber);
            onNextBlock(blockNumber);
            tx = clone(self.tx.Trade.trade);
            tx.params = [abi.fix(max_value, "hex"), abi.fix(max_amount, "hex"), trade_ids, tradeGroupID || 0];
            if (self.options.debug.trading) {
              console.log("trade tx:", JSON.stringify(tx, null, 2));
            }
            self.transact(tx, onTradeSent, utils.compose(function (result, cb) {
              var err, txHash;
              if (self.options.debug.trading) {
                console.log("trade response:", JSON.stringify(result, null, 2));
              }
              txHash = result.hash;
              if (result.callReturn && result.callReturn.constructor === Array) {
                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                if (result.callReturn[0] !== 1 || result.callReturn.length !== 3) {
                  err = self.rpc.errorCodes("trade", "number", result.callReturn[0]);
                  if (!err) {
                    err = clone(self.errors.TRADE_FAILED);
                    err.hash = txHash;
                    err.message += result.callReturn[0].toString();
                    return onTradeFailed(err);
                  }
                  return onTradeFailed({error: err, message: self.errors.trade[err], tx: tx, hash: txHash});
                }
                self.rpc.receipt(txHash, function (receipt) {
                  var parsedReceipt;
                  if (!receipt) return onTradeFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
                  if (receipt.error) return onTradeFailed(receipt);
                  parsedReceipt = self.parseTradeReceipt(receipt);
                  cb({
                    hash: txHash,
                    unmatchedCash: abi.unfix_signed(result.callReturn[1], "string"),
                    unmatchedShares: abi.unfix(result.callReturn[2], "string"),
                    sharesBought: parsedReceipt.sharesBought,
                    cashFromTrade: parsedReceipt.cashFromTrade,
                    tradingFees: parsedReceipt.tradingFees,
                    gasFees: result.gasFees,
                    timestamp: result.timestamp
                  });
                });
              } else {
                err = self.rpc.errorCodes("trade", "number", result.callReturn);
                if (!err) {
                  err = clone(self.errors.TRADE_FAILED);
                  err.hash = txHash;
                  err.message += result.callReturn.toString();
                  return onTradeFailed(err);
                }
                onTradeFailed({error: err, message: self.errors[err], tx: tx, hash: txHash});
              }
            }, onTradeSuccess), onTradeFailed);
          });
        },
        onFailed: onCommitFailed
      });
    });
  },

  short_sell: function (buyer_trade_id, max_amount, tradeGroupID, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
    var self = this;
    if (this.options.debug.trading) {
      console.log("short_sell:", JSON.stringify(buyer_trade_id, null, 2));
    }
    if (buyer_trade_id.constructor === Object) {
      max_amount = buyer_trade_id.max_amount;
      tradeGroupID = buyer_trade_id.tradeGroupID;
      sender = buyer_trade_id.sender;
      onTradeHash = buyer_trade_id.onTradeHash;
      onCommitSent = buyer_trade_id.onCommitSent;
      onCommitSuccess = buyer_trade_id.onCommitSuccess;
      onCommitFailed = buyer_trade_id.onCommitFailed;
      onNextBlock = buyer_trade_id.onNextBlock;
      onTradeSent = buyer_trade_id.onTradeSent;
      onTradeSuccess = buyer_trade_id.onTradeSuccess;
      onTradeFailed = buyer_trade_id.onTradeFailed;
      buyer_trade_id = buyer_trade_id.buyer_trade_id;
    }
    onTradeHash = onTradeHash || utils.noop;
    onCommitSent = onCommitSent || utils.noop;
    onCommitSuccess = onCommitSuccess || utils.noop;
    onCommitFailed = onCommitFailed || utils.noop;
    onNextBlock = onNextBlock || utils.noop;
    onTradeSent = onTradeSent || utils.noop;
    onTradeSuccess = onTradeSuccess || utils.noop;
    onTradeFailed = onTradeFailed || utils.noop;
    this.checkGasLimit([buyer_trade_id], abi.format_address(sender || this.from), function (err, trade_ids) {
      var tradeHash;
      if (err) return onTradeFailed(err);
      tradeHash = self.makeTradeHash(0, max_amount, trade_ids);
      onTradeHash(tradeHash);
      self.commitTrade({
        hash: tradeHash,
        onSent: onCommitSent,
        onSuccess: function (res) {
          onCommitSuccess(res);
          self.rpc.fastforward(1, function (blockNumber) {
            var tx;
            onNextBlock(blockNumber);
            tx = clone(self.tx.Trade.short_sell);
            tx.params = [buyer_trade_id, abi.fix(max_amount, "hex"), tradeGroupID || 0];
            if (self.options.debug.trading) {
              console.log("short_sell tx:", JSON.stringify(tx, null, 2));
            }
            self.transact(tx, onTradeSent, utils.compose(function (result, cb) {
              var err, txHash;
              if (self.options.debug.trading) {
                console.log("short_sell response:", JSON.stringify(result, null, 2));
              }
              txHash = result.hash;
              if (result.callReturn && result.callReturn.constructor === Array) {
                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                if (result.callReturn[0] !== 1 || result.callReturn.length !== 4) {
                  err = self.rpc.errorCodes("short_sell", "number", result.callReturn[0]);
                  if (!err) {
                    err = clone(self.errors.TRADE_FAILED);
                    err.hash = txHash;
                    err.message += result.callReturn[0].toString();
                    return onTradeFailed(err);
                  }
                  return onTradeFailed({error: err, message: self.errors.short_sell[err], tx: tx, hash: txHash});
                }
                self.rpc.receipt(txHash, function (receipt) {
                  var parsedReceipt;
                  if (!receipt) return onTradeFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
                  if (receipt.error) return onTradeFailed(receipt);
                  parsedReceipt = self.parseShortSellReceipt(receipt);
                  cb({
                    hash: txHash,
                    unmatchedShares: abi.unfix(result.callReturn[1], "string"),
                    matchedShares: abi.unfix_signed(result.callReturn[2], "string"),
                    cashFromTrade: parsedReceipt.cashFromTrade,
                    price: abi.unfix_signed(result.callReturn[3], "string"),
                    tradingFees: parsedReceipt.tradingFees,
                    gasFees: result.gasFees,
                    timestamp: result.timestamp
                  });
                });
              } else {
                err = self.rpc.errorCodes("short_sell", "number", result.callReturn);
                if (!err) {
                  err = clone(self.errors.TRADE_FAILED);
                  err.hash = txHash;
                  err.message += result.callReturn.toString();
                  return onTradeFailed(err);
                }
                onTradeFailed({error: err, message: self.errors.short_sell[err], tx: tx, hash: txHash});
              }
            }, onTradeSuccess), onTradeFailed);
          });
        },
        onFailed: onCommitFailed
      });
    });
  }
};
