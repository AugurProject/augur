"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var checkGasLimit = require("./check-gas-limit");
var makeTradeHash = require("./make-trade-hash");
var parseShortSellReceipt = require("./parse-short-sell-receipt");
var isObject = require("../utils/is-object");
var noop = require("../utils/noop");
var compose = require("../utils/compose");
var rpcInterface = require("../rpc-interface");
var errors = rpcInterface.errors;
var constants = require("../constants");

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
  checkGasLimit([buyer_trade_id], abi.format_address(sender), function (err, trade_ids) {
    var tradeHash;
    if (err) return onTradeFailed(err);
    tradeHash = makeTradeHash(0, max_amount, trade_ids);
    onTradeHash(tradeHash);
    api.Trades.commitTrade({
      hash: tradeHash,
      onSent: onCommitSent,
      onSuccess: function (res) {
        onCommitSuccess(res);
        rpcInterface.waitForNextBlocks(1, function (blockNumber) {
          onNextBlock(blockNumber);
          api.Trade.short_sell({
            buyer_trade_id: buyer_trade_id,
            max_amount: abi.fix(max_amount, "hex"),
            tradeGroupID: tradeGroupID || 0,
            onSent: onTradeSent,
            onSuccess: compose(function (result, callback) {
              var err, txHash;
              // console.log("short_sell response:", JSON.stringify(result, null, 2));
              txHash = result.hash;
              if (result.callReturn && Array.isArray(result.callReturn)) {
                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                if (result.callReturn[0] !== 1 || result.callReturn.length !== 4) {
                  err = rpcInterface.handleRPCError("short_sell", "number", result.callReturn[0]);
                  if (!err) {
                    err = clone(errors.TRADE_FAILED);
                    err.hash = txHash;
                    err.message += result.callReturn[0].toString();
                    return onTradeFailed(err);
                  }
                  return onTradeFailed({ error: err, message: errors.short_sell[err], tx: tx, hash: txHash });
                }
                rpcInterface.getTransactionReceipt(txHash, function (receipt) {
                  var parsedReceipt;
                  if (!receipt) return onTradeFailed(errors.TRANSACTION_RECEIPT_NOT_FOUND);
                  if (receipt.error) return onTradeFailed(receipt);
                  parsedReceipt = parseShortSellReceipt(receipt);
                  callback({
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
                err = rpcInterface.handleRPCError("short_sell", "number", result.callReturn);
                if (!err) {
                  err = clone(errors.TRADE_FAILED);
                  err.hash = txHash;
                  err.message += result.callReturn.toString();
                  return onTradeFailed(err);
                }
                onTradeFailed({ error: err, message: errors.short_sell[err], tx: tx, hash: txHash });
              }
            }, onTradeSuccess),
            onFailed: onTradeFailed
          });
        });
      },
      onFailed: onCommitFailed
    });
  });
}

module.exports = short_sell;
