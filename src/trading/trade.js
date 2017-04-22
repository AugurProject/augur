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
function trade(max_value, max_amount, trade_ids, tradeGroupID, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed) {
  if (isObject(max_value)) {
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
  onTradeHash = onTradeHash || noop;
  onCommitSent = onCommitSent || noop;
  onCommitSuccess = onCommitSuccess || noop;
  onCommitFailed = onCommitFailed || noop;
  onNextBlock = onNextBlock || noop;
  onTradeSent = onTradeSent || noop;
  onTradeSuccess = onTradeSuccess || noop;
  onTradeFailed = onTradeFailed || noop;
  checkGasLimit(trade_ids, abi.format_address(sender), function (err, trade_ids) {
    var bn_max_value, tradeHash;
    if (err) return onTradeFailed(err);
    bn_max_value = abi.bignum(max_value);
    if (bn_max_value.gt(constants.ZERO) && bn_max_value.lt(constants.MINIMUM_TRADE_SIZE)) {
      return onTradeFailed({error: "-4", message: errors.trade["-4"]});
    }
    tradeHash = makeTradeHash(max_value, max_amount, trade_ids);
    onTradeHash(tradeHash);
    self.commitTrade({
      hash: tradeHash,
      onSent: onCommitSent,
      onSuccess: function (res) {
        onCommitSuccess(res);
        self.rpc.waitForNextBlocks(1, function (blockNumber) {
          var tx;
          onNextBlock(blockNumber);
          tx = clone(store.getState().contractsAPI.functions.Trade.trade);
          tx.params = [abi.fix(max_value, "hex"), abi.fix(max_amount, "hex"), trade_ids, tradeGroupID || 0];
          // console.log("trade tx:", JSON.stringify(tx, null, 2));
          self.transact(tx, onTradeSent, compose(function (result, cb) {
            var err, txHash;
            // console.log("trade response:", JSON.stringify(result, null, 2));
            txHash = result.hash;
            if (Array.isArray(result.callReturn)) {
              result.callReturn[0] = parseInt(result.callReturn[0], 16);
              if (result.callReturn[0] !== 1 || result.callReturn.length !== 3) {
                err = self.rpc.errorCodes("trade", "number", result.callReturn[0]);
                if (!err) {
                  err = clone(errors.TRADE_FAILED);
                  err.hash = txHash;
                  err.message += result.callReturn[0].toString();
                  return onTradeFailed(err);
                }
                return onTradeFailed({error: err, message: errors.trade[err], tx: tx, hash: txHash});
              }
              self.rpc.getTransactionReceipt(txHash, function (receipt) {
                var parsedReceipt;
                if (!receipt) return onTradeFailed(errors.TRANSACTION_RECEIPT_NOT_FOUND);
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
                err = clone(errors.TRADE_FAILED);
                err.hash = txHash;
                err.message += result.callReturn.toString();
                return onTradeFailed(err);
              }
              onTradeFailed({error: err, message: errors[err], tx: tx, hash: txHash});
            }
          }, onTradeSuccess), onTradeFailed);
        });
      },
      onFailed: onCommitFailed
    });
  });
}

module.exports = trade;
