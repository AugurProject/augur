"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var makeTradeHash = require("./make-trade-hash");
var parseTradeReceipt = require("./parse-trade-receipt");
var checkGasLimit = require("../check-gas-limit");
var api = require("../../api");
var isObject = require("../../utils/is-object");
var noop = require("../../utils/noop");
var compose = require("../../utils/compose");
var rpcInterface = require("../../rpc-interface");
var errors = rpcInterface.errors;
var constants = require("../../constants");

// TODO break this up
// { max_value, max_amount, trade_ids, tradeGroupID, sender, onTradeHash, onCommitSent, onCommitSuccess, onCommitFailed, onNextBlock, onTradeSent, onTradeSuccess, onTradeFailed }
function trade(p) {
  var onTradeHash = onTradeHash || noop;
  var onCommitSent = onCommitSent || noop;
  var onCommitSuccess = onCommitSuccess || noop;
  var onCommitFailed = onCommitFailed || noop;
  var onNextBlock = onNextBlock || noop;
  var onTradeSent = onTradeSent || noop;
  var onTradeSuccess = onTradeSuccess || noop;
  var onTradeFailed = onTradeFailed || noop;
  checkGasLimit(p.trade_ids, abi.format_address(p.sender), function (err, trade_ids) {
    var bn_max_value, tradeHash;
    if (err) return onTradeFailed(err);
    bn_max_value = abi.bignum(p.max_value);
    if (bn_max_value.gt(constants.ZERO) && bn_max_value.lt(constants.MINIMUM_TRADE_SIZE)) {
      return onTradeFailed({error: "-4", message: errors.trade["-4"]});
    }
    tradeHash = makeTradeHash(p.max_value, p.max_amount, trade_ids);
    onTradeHash(tradeHash);
    api().Trades.commitTrade({
      hash: tradeHash,
      onSent: onCommitSent,
      onSuccess: function (res) {
        onCommitSuccess(res);
        rpcInterface.waitForNextBlocks(1, function (blockNumber) {
          onNextBlock(blockNumber);
          api().Trade.trade({
            max_value: abi.fix(p.max_value, "hex"),
            max_amount: abi.fix(p.max_amount, "hex"),
            trade_ids: trade_ids,
            tradeGroupID: p.tradeGroupID || 0,
            onSent: onTradeSent,
            onSuccess: compose(function (result, callback) {
              var err, txHash;
              // console.log("trade response:", JSON.stringify(result, null, 2));
              txHash = result.hash;
              if (Array.isArray(result.callReturn)) {
                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                if (result.callReturn[0] !== 1 || result.callReturn.length !== 3) {
                  err = rpcInterface.handleRPCError("trade", "number", result.callReturn[0]);
                  if (!err) {
                    err = clone(errors.TRADE_FAILED);
                    err.hash = txHash;
                    err.message += result.callReturn[0].toString();
                    return onTradeFailed(err);
                  }
                  return onTradeFailed({ error: err, message: errors.trade[err], hash: txHash });
                }
                rpcInterface.getTransactionReceipt(txHash, function (receipt) {
                  var parsedReceipt;
                  if (!receipt) return onTradeFailed(errors.TRANSACTION_RECEIPT_NOT_FOUND);
                  if (receipt.error) return onTradeFailed(receipt);
                  parsedReceipt = parseTradeReceipt(receipt);
                  callback({
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
                err = rpcInterface.handleRPCError("trade", "number", result.callReturn);
                if (!err) {
                  err = clone(errors.TRADE_FAILED);
                  err.hash = txHash;
                  err.message += result.callReturn.toString();
                  return onTradeFailed(err);
                }
                onTradeFailed({ error: err, message: errors[err], hash: txHash });
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

module.exports = trade;
