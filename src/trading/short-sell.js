"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var checkGasLimit = require("./check-gas-limit");
var makeTradeHash = require("./make-trade-hash");
var isObject = require("../utils/is-object");
var constants = require("../constants");
var rpcInterface = require("../rpc-interface");
var errors = rpcInterface.errors;

// TODO break this up
function short_sell(buyer_trade_id, max_amount, tradeGroupID, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
  if (isObject(buyer_trade_id)) {
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
  onTradeHash = onTradeHash || noop;
  onCommitSent = onCommitSent || noop;
  onCommitSuccess = onCommitSuccess || noop;
  onCommitFailed = onCommitFailed || noop;
  onNextBlock = onNextBlock || noop;
  onTradeSent = onTradeSent || noop;
  onTradeSuccess = onTradeSuccess || noop;
  onTradeFailed = onTradeFailed || noop;
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
        self.rpc.waitForNextBlocks(1, function (blockNumber) {
          var tx;
          onNextBlock(blockNumber);
          tx = clone(store.getState().contractsAPI.functions.Trade.short_sell);
          tx.params = [buyer_trade_id, abi.fix(max_amount, "hex"), tradeGroupID || 0];
          if (self.options.debug.trading) {
            console.log("short_sell tx:", JSON.stringify(tx, null, 2));
          }
          self.transact(tx, onTradeSent, compose(function (result, cb) {
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
              self.rpc.getTransactionReceipt(txHash, function (receipt) {
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

module.exports = short_sell;
