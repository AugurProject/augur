/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var async = require("async");
var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var abi = require("augur-abi");
var rpc = require("ethrpc");
var utils = require("../utilities");
var constants = require("../constants");
var abacus = require("./abacus");

module.exports = {

  selectOrder: function (orderID, orderBooks) {
    var marketIDs = Object.keys(orderBooks);
    var numMarkets = marketIDs.length;
    for (var i = 0; i < numMarkets; ++i) {
      var orderBook = orderBooks[marketIDs[i]];
      var order = this.selectOrderInOrderBookSide(orderID, orderBook.buy) ||
        this.selectOrderInOrderBookSide(orderID, orderBook.sell);
      if (order) return order;
    }
  },

  selectOrderInOrderBookSide: function (orderID, orderBookSide) {
    var orderIDs = Object.keys(orderBookSide);
    var numOrderIDs = orderIDs.length;
    for (var j = 0; j < numOrderIDs; ++j) {
      if (orderBookSide[orderID]) return orderBookSide[orderID];
    }
  },

  // if buying numShares must be 0, if selling totalEthWithFee must be 0
  executeTrade: function (marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
    console.log('executeTrade:', marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks);
    console.log('getTradeIDs:', getTradeIDs.toString());
    var self = this;
    var bnTotalEth = abi.bignum(totalEthWithFee) || constants.ZERO;
    var bnNumShares = abi.bignum(numShares) || constants.ZERO;
    var res = {
      remainingEth: bnTotalEth,
      remainingShares: bnNumShares,
      filledShares: constants.ZERO,
      filledEth: constants.ZERO,
      tradingFees: constants.ZERO,
      gasFees: constants.ZERO
    };
    var matchingTradeIDs;
    var bnSharesPurchased = bnNumShares;
    var bnCashBalance = bnTotalEth;
    async.until(function () {
      matchingTradeIDs = getTradeIDs();
      console.log("matchingTradeIDs:", matchingTradeIDs);
      console.log("remainingEth:", res.remainingEth.toFixed());
      console.log("remainingShares:", res.remainingShares.toFixed());
      console.log("sharesPurchased:", bnSharesPurchased.toFixed());
      console.log("balance:", bnCashBalance.toFixed());
      return !matchingTradeIDs || !matchingTradeIDs.length ||
        (res.remainingEth.lte(constants.PRECISION.zero) && res.remainingShares.lte(constants.PRECISION.zero)) ||
        (bnNumShares.gt(constants.ZERO) && bnSharesPurchased.lte(constants.PRECISION.zero)) ||
        (bnTotalEth.gt(constants.ZERO) && bnCashBalance.lte(constants.PRECISION.zero));
    }, function (nextTrade) {
      var tradeIDs = matchingTradeIDs;
      tradeIDs = tradeIDs.slice(0, 3);
      self.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
        bnSharesPurchased = abi.bignum(sharesPurchased);
        self.getCashBalance(address, function (cashBalance) {
          bnCashBalance = abi.bignum(cashBalance);
          var isRemainder;
          var maxAmount;
          if (res.remainingShares.gt(bnSharesPurchased)) {
            maxAmount = bnSharesPurchased;
            isRemainder = true;
          } else {
            maxAmount = res.remainingShares;
            isRemainder = false;
          }
          var maxValue = BigNumber.min(res.remainingEth, bnCashBalance);
          self.trade({
            max_value: maxValue.toFixed(),
            max_amount: maxAmount.toFixed(),
            trade_ids: tradeIDs,
            tradeGroupID: tradeGroupID,
            sender: address,
            onTradeHash: function (tradeHash) {
              tradeCommitmentCallback({
                tradeHash: abi.format_int256(tradeHash),
                orders: tradeIDs.map(function (tradeID) {
                  return self.selectOrder(tradeID, orderBooks);
                }),
                maxValue: maxValue.toFixed(),
                maxAmount: maxAmount.toFixed(),
                remainingEth: res.remainingEth.toFixed(),
                remainingShares: res.remainingShares.toFixed(),
                filledEth: res.filledEth.toFixed(),
                filledShares: res.filledShares.toFixed(),
                tradingFees: res.tradingFees.gt(constants.ZERO) ? res.tradingFees.toFixed() : tradingFees,
                gasFees: res.gasFees.toFixed()
              });
            },
            onCommitSent: function (data) { console.log("commit sent:", data); },
            onCommitSuccess: function (data) {
              res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
              tradeCommitmentCallback({ gasFees: res.gasFees.toFixed() });
            },
            onCommitFailed: nextTrade,
            onNextBlock: function (data) { console.log("trade-onNextBlock", data); },
            onTradeSent: function (data) { console.log("trade sent:", data); },
            onTradeSuccess: function (data) {
              console.log("trade success:", data);
              res.filledShares = res.filledShares.plus(abi.bignum(data.sharesBought));
              res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
              if (isRemainder) {
                res.remainingShares = res.remainingShares.minus(maxAmount).plus(abi.bignum(data.unmatchedShares));
              } else {
                res.remainingShares = abi.bignum(data.unmatchedShares);
              }
              res.remainingEth = abi.bignum(data.unmatchedCash);
              res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
              res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
              tradeCommitmentCallback({
                filledShares: res.filledShares.toFixed(),
                filledEth: res.filledEth.toFixed(),
                remainingShares: res.remainingShares.toFixed(),
                remainingEth: res.remainingEth.toFixed(),
                tradingFees: res.tradingFees.toFixed(),
                gasFees: res.gasFees.toFixed()
              });
              self.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
                bnSharesPurchased = abi.bignum(sharesPurchased);
                self.getCashBalance(address, function (cashBalance) {
                  bnCashBalance = abi.bignum(cashBalance);
                  nextTrade();
                });
              });
            },
            onTradeFailed: nextTrade
          });
        });
      });
    }, function (err) {
      if (err) return cb(err);
      console.log("trade complete:", JSON.stringify(res, null, 2));
      cb(null, res);
    });
  },

  executeShortSell: function (marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
    var self = this;
    var res = {
      remainingShares: abi.bignum(numShares) || constants.ZERO,
      filledShares: constants.ZERO,
      filledEth: constants.ZERO,
      tradingFees: constants.ZERO,
      gasFees: constants.ZERO
    };
    var matchingIDs = getTradeIDs();
    console.log("matching trade IDs:", matchingIDs);
    if (!matchingIDs || !matchingIDs.length || res.remainingShares.lte(constants.ZERO)) return cb(null, res);
    async.eachSeries(matchingIDs, function (matchingID, nextMatchingID) {
      var maxAmount = res.remainingShares.toFixed();
      self.short_sell({
        max_amount: maxAmount,
        buyer_trade_id: matchingID,
        sender: address,
        tradeGroupID: tradeGroupID,
        onTradeHash: function (tradeHash) {
          tradeCommitmentCallback({
            tradeHash: abi.format_int256(tradeHash),
            orders: [self.selectOrder(matchingID, orderBooks)],
            maxValue: "0",
            maxAmount: maxAmount,
            remainingEth: "0",
            remainingShares: res.remainingShares.toFixed(),
            filledEth: res.filledEth.toFixed(),
            filledShares: res.filledShares.toFixed(),
            tradingFees: res.tradingFees.gt(constants.ZERO) ? res.tradingFees.toFixed() : tradingFees,
            gasFees: res.gasFees.toFixed()
          });
        },
        onCommitSent: function (data) { console.log("short sell commit sent:", data); },
        onCommitSuccess: function (data) {
          res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
          tradeCommitmentCallback({ gasFees: res.gasFees.toFixed() });
        },
        onCommitFailed: nextMatchingID,
        onNextBlock: function (data) { console.log("short_sell onNextBlock", data); },
        onTradeSent: function (data) { console.debug("short sell sent", data); },
        onTradeSuccess: function (data) {
          if (data.unmatchedShares) {
            res.remainingShares = abi.bignum(data.unmatchedShares);
          } else {
            res.remainingShares = constants.ZERO;
          }
          if (data.matchedShares) {
            res.filledShares = res.filledShares.plus(abi.bignum(data.matchedShares));
          }
          if (data.cashFromTrade) {
            res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
          }
          res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
          res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
          tradeCommitmentCallback({
            filledShares: res.filledShares.toFixed(),
            filledEth: res.filledEth.toFixed(),
            remainingShares: res.remainingShares.toFixed(),
            tradingFees: res.tradingFees.toFixed(),
            gasFees: res.gasFees.toFixed()
          });
          if (res.remainingShares.gt(constants.PRECISION.zero)) return nextMatchingID();
          nextMatchingID({ isComplete: true });
        },
        onTradeFailed: nextMatchingID
      });
    }, function (err) {
      if (err && !err.isComplete) return cb(err);
      console.log("short_sell success:", JSON.stringify(res, null, 2));
      cb(null, res);
    });
  },

  splitAskAndShortAsk: function (numShares, position) {
    var askShares, shortAskShares;
    if (position.gt(numShares)) {
      askShares = numShares.round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
      shortAskShares = 0;
    } else {
      askShares = position.toFixed();
      shortAskShares = numShares.minus(position).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN).toFixed();
    }
    return { askShares: askShares, shortAskShares: shortAskShares };
  },

  getScalarMinimum: function (type, minValue) {
    var scalarMinimum = {};
    if (type === "scalar") scalarMinimum.minValue = minValue;
    return scalarMinimum;
  },

  parametrizeOrder: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    return {
      amount: numShares,
      price: limitPrice,
      market: market.id,
      outcome: outcomeID,
      tradeGroupID: tradeGroupID,
      scalarMinMax: this.getScalarMinimum(market.type, market.minValue)
    };
  },

  placeBid: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    var params = this.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("bid sent:", res); };
    params.onSuccess = function (res) { console.log("bid success:", res); };
    params.onFailed = function (err) { console.error("bid failed:", err); };
    return this.buy(params);
  },

  placeAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    var params = this.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("ask sent:", res); };
    params.onSuccess = function (res) { console.log("ask success:", res); };
    params.onFailed = function (err) { console.error("ask failed:", err); };
    return this.sell(params);
  },

  placeShortAsk: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    var params = this.parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID);
    params.onSent = function (res) { console.log("short ask sent:", res); };
    params.onSuccess = function (res) { console.log("short ask success:", res); };
    params.onFailed = function (err) { console.error("short ask failed:", err); };
    return this.shortAsk(params);
  },

  calculateBuyTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
    var orders = (orderBooks[marketID] && orderBooks[marketID].sell) || {};
    return this.filterByPriceAndOutcomeAndUserSortByPrice(orders, "buy", limitPrice, outcomeID, address).map(function (order) { return order.id; });
  },

  calculateSellTradeIDs: function (marketID, outcomeID, limitPrice, orderBooks, address) {
    var orders = (orderBooks[marketID] && orderBooks[marketID].buy) || {};
    return this.filterByPriceAndOutcomeAndUserSortByPrice(orders, "sell", limitPrice, outcomeID, address).map(function (order) { return order.id; });
  },

  placeBuy: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback) {
    // dispatch(updateTradeCommitLock(true));
    var self = this;
    var marketID = market.id;
    var getTradeIDs = function () {
      return self.calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeTrade(marketID, outcomeID, 0, totalCost, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback || utils.noop, function (err, res) {
      // dispatch(updateTradeCommitLock(false));
      if (err) return console.error("trade failed:", err);
      var sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
      if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
        console.debug("buy remainder:", sharesRemaining.toFixed(), "shares remaining,", res.remainingEth.toFixed(), "cash remaining", constants.PRECISION.limit.toFixed(), "precision limit");
        self.placeBid(market, outcomeID, sharesRemaining.toFixed(), limitPrice, tradeGroupID);
      }
    });
  },

  placeSell: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback) {
    var self = this;
    // dispatch(updateTradeCommitLock(true));
    var marketID = market.id;
    var getTradeIDs = function () {
      return self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeTrade(marketID, outcomeID, numShares, 0, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback || utils.noop, function (err, res) {
      // dispatch(updateTradeCommitLock(false));
      if (err) return console.error("trade failed:", err);
      if (res.remainingShares.gt(constants.PRECISION.zero)) {
        self.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
          var position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
          var remainingShares = abi.bignum(res.remainingShares);
          if (position.gt(constants.PRECISION.zero)) {
            var shares = self.splitAskAndShortAsk(remainingShares, position);
            var askShares = shares.askShares;
            var shortAskShares = shares.shortAskShares;
            if (abi.bignum(askShares).gt(constants.PRECISION.zero)) {
              self.placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID);
            }
            if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
              self.placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
            }
          } else {
            self.getOrderBook(marketID, function (updatedOrderBook) {
              if (err) console.error("getOrderBook:", err);
              var orderBook = {};
              orderBook[marketID] = updatedOrderBook;
              var tradeIDs = self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBook, address);
              if (tradeIDs && tradeIDs.length) {
                self.placeShortSell(market, outcomeID, res.remainingShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback);
              } else {
                self.placeShortAsk(market, outcomeID, res.remainingShares, limitPrice, tradeGroupID);
              }
            });
          }
        });
      }
    });
  },

  placeShortSell: function (market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback) {
    var self = this;
    // dispatch(updateTradeCommitLock(true));
    var marketID = market.id;
    var getTradeIDs = function () {
      return self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
    };
    this.executeShortSell(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback || utils.noop, function (err, res) {
      // dispatch(updateTradeCommitLock(false));
      if (err) return console.error("shortSell failed:", err);
      if (res.remainingShares.gt(constants.PRECISION.zero)) {
        self.placeShortAsk(market, outcomeID, res.remainingShares.toFixed(), limitPrice, tradeGroupID);
      }
    });
  },

  // market: {id, type, minValue (for scalars)}
  placeTrade: function (market, outcomeID, tradeType, numShares, limitPrice, tradingFees, address, totalCost, orderBooks, tradeCommitmentCallback, callback) {
    var self = this;
    var marketID = market.id;
    var tradeGroupID = abi.format_int256(new Buffer(uuidParse.parse(uuid.v4())).toString("hex"));
    if (tradeType === "buy") {
      var tradeIDs = this.calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
      console.log('buy trade IDs:', tradeIDs);
      if (tradeIDs && tradeIDs.length) {
        console.log('place buy:', market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID);
        this.placeBuy(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback);
      } else {
        console.log('place bid:', market, outcomeID, numShares, limitPrice, tradeGroupID);
        this.placeBid(market, outcomeID, numShares, limitPrice, tradeGroupID);
      }
      callback(null);
    } else if (tradeType === "sell") {

      // check if user has position
      //  - if so, sell/ask
      //  - if not, short sell/short ask
      this.getParticipantSharesPurchased(marketID, address, outcomeID, function (sharesPurchased) {
        if (!sharesPurchased || sharesPurchased.error) return callback(sharesPurchased);
        var position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
        var tradeIDs = self.calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, address);
        if (position && position.gt(constants.PRECISION.zero)) {
          if (tradeIDs && tradeIDs.length) {
            self.placeSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback);
          } else {
            var shares = self.splitAskAndShortAsk(abi.bignum(numShares), position);
            var askShares = shares.askShares;
            var shortAskShares = shares.shortAskShares;
            if (abi.bignum(askShares).gt(constants.PRECISION.zero)) {
              self.placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID);
            }
            if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
              self.placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
            }
          }
        } else if (tradeIDs && tradeIDs.length) {
          self.placeShortSell(market, outcomeID, numShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback);
        } else {
          self.placeShortAsk(market, outcomeID, numShares, limitPrice, tradeGroupID);
        }
        callback(null);
      });
    }
    return tradeGroupID;
  },

  // tradeTypes: array of "buy" and/or "sell"
  // gasLimit (optional): block gas limit as integer
  isUnderGasLimit: function (tradeTypes, gasLimit, callback) {
    if (utils.is_function(gasLimit) && !callback) {
      callback = gasLimit;
      gasLimit = null;
    }
    var gas = abacus.sumTradeGas(tradeTypes);
    if (!utils.is_function(callback)) {
      if (gasLimit) return gas <= gasLimit;
      return gas <= parseInt(this.rpc.getBlock(this.rpc.blockNumber()).gasLimit, 16);
    }
    if (gasLimit) return callback(gas <= gasLimit);
    var self = this;
    this.rpc.blockNumber(function (blockNumber) {
      self.rpc.getBlock(blockNumber, false, function (block) {
        callback(gas <= parseInt(block.gasLimit, 16));
      });
    });
  },

  checkGasLimit: function (trade_ids, sender, callback) {
    var self = this;
    var gas = 0;
    var count = {buy: 0, sell: 0};
    self.rpc.blockNumber(function (blockNumber) {
      self.rpc.getBlock(blockNumber, false, function (block) {
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
            gas += constants.TRADE_GAS[Number(!!i)][trade.type];
            next();
          });
        }, function (e) {
          if (e) return callback(e);
          if (gas <= parseInt(block.gasLimit, 16)) {
            return callback(null, checked_trade_ids);
          } else if (!count.buy || !count.sell) {
            var type = (count.buy) ? "buy" : "sell";
            return callback(null, checked_trade_ids.slice(0, abacus.maxOrdersPerTrade(type, block.gasLimit)));
          }
          callback(self.errors.GAS_LIMIT_EXCEEDED);
        });
      });
    });
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
      if (self.options.debug.trading) console.log('checkGasLimit:', err, trade_ids);
      if (err) return onTradeFailed(err);
      var bn_max_value = abi.bignum(max_value);
      if (bn_max_value.gt(constants.ZERO) && bn_max_value.lt(constants.MINIMUM_TRADE_SIZE)) {
        return onTradeFailed({error: "-4", message: self.errors.trade["-4"]});
      }
      var tradeHash = self.makeTradeHash(max_value, max_amount, trade_ids);
      if (self.options.debug.trading) console.log('tradeHash:', tradeHash);
      onTradeHash(tradeHash);
      self.commitTrade({
        hash: tradeHash,
        onSent: onCommitSent,
        onSuccess: function (res) {
          if (self.options.debug.trading) console.log('commitTrade:', res);
          onCommitSuccess(res);
          self.rpc.fastforward(1, function (blockNumber) {
            if (self.options.debug.trading) console.log('fastforward:', blockNumber);
            onNextBlock(blockNumber);
            var tx = clone(self.tx.Trade.trade);
            tx.params = [abi.fix(max_value, "hex"), abi.fix(max_amount, "hex"), trade_ids, tradeGroupID];
            if (self.options.debug.trading) {
              console.log("trade tx:", JSON.stringify(tx, null, 2));
            }
            var prepare = function (result, cb) {
              if (self.options.debug.trading) {
                console.log("trade response:", JSON.stringify(result, null, 2));
              }
              var err;
              var txHash = result.hash;
              if (result.callReturn && result.callReturn.constructor === Array) {
                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                if (result.callReturn[0] !== 1 || result.callReturn.length !== 3) {
                  err = self.rpc.errorCodes("trade", "number", result.callReturn[0]);
                  if (!err) {
                    err = clone(self.errors.TRADE_FAILED);
                    err.message += result.callReturn[0].toString();
                    return onTradeFailed(err);
                  }
                  return onTradeFailed({error: err, message: self.errors.trade[err], tx: tx});
                }
                self.rpc.receipt(txHash, function (receipt) {
                  if (!receipt) return onTradeFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
                  if (receipt.error) return onTradeFailed(receipt);
                  var sharesBought, cashFromTrade, tradingFees, logs, sig, logdata;
                  if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
                    logs = receipt.logs;
                    sig = self.api.events.log_fill_tx.signature;
                    sharesBought = constants.ZERO;
                    cashFromTrade = constants.ZERO;
                    tradingFees = constants.ZERO;
                    for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                      if (logs[i].topics[0] === sig) {
                        logdata = self.rpc.unmarshal(logs[i].data);
                        if (logdata && logdata.constructor === Array && logdata.length > 6) {
                          tradingFees = tradingFees.plus(abi.unfix(logdata[6]));

                              // buy (matched sell order)
                          if (parseInt(logdata[0], 16) === 1) {
                            sharesBought = sharesBought.plus(abi.unfix(logdata[2]));

                                  // sell (matched buy order)
                                  // cash received = price per share * shares sold
                          } else {
                            cashFromTrade = cashFromTrade.plus(abi.unfix(abi.hex(logdata[8], true)).times(abi.unfix(logdata[2])));
                          }
                        }
                      }
                    }
                  }
                  cb({
                    hash: txHash,
                    unmatchedCash: abi.unfix(abi.hex(result.callReturn[1], true), "string"),
                    unmatchedShares: abi.unfix(result.callReturn[2], "string"),
                    sharesBought: abi.string(sharesBought),
                    cashFromTrade: abi.string(cashFromTrade),
                    tradingFees: abi.string(tradingFees),
                    gasFees: result.gasFees,
                    timestamp: result.timestamp
                  });
                });
              } else {
                err = self.rpc.errorCodes("trade", "number", result.callReturn);
                if (!err) {
                  err = clone(self.errors.TRADE_FAILED);
                  err.message += result.callReturn.toString();
                  return onTradeFailed(result);
                }
                onTradeFailed({error: err, message: self.errors[err], tx: tx});
              }
            };
            self.transact(tx, onTradeSent, utils.compose(prepare, onTradeSuccess), onTradeFailed);
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
      if (err) return onTradeFailed(err);
      var tradeHash = self.makeTradeHash(0, max_amount, trade_ids);
      onTradeHash(tradeHash);
      self.commitTrade({
        hash: tradeHash,
        onSent: onCommitSent,
        onSuccess: function (res) {
          onCommitSuccess(res);
          self.rpc.fastforward(1, function (blockNumber) {
            onNextBlock(blockNumber);
            var tx = clone(self.tx.Trade.short_sell);
            tx.params = [buyer_trade_id, abi.fix(max_amount, "hex"), tradeGroupID];
            if (self.options.debug.trading) {
              console.log("short_sell tx:", JSON.stringify(tx, null, 2));
            }
            var prepare = function (result, cb) {
              if (self.options.debug.trading) {
                console.log("short_sell response:", JSON.stringify(result, null, 2));
              }
              var err;
              var txHash = result.hash;
              if (result.callReturn && result.callReturn.constructor === Array) {
                result.callReturn[0] = parseInt(result.callReturn[0], 16);
                if (result.callReturn[0] !== 1 || result.callReturn.length !== 4) {
                  err = self.rpc.errorCodes("short_sell", "number", result.callReturn[0]);
                  if (!err) {
                    err = clone(self.errors.TRADE_FAILED);
                    err.message += result.callReturn[0].toString();
                    return onTradeFailed(err);
                  }
                  return onTradeFailed({error: err, message: self.errors.short_sell[err], tx: tx});
                }
                self.rpc.receipt(txHash, function (receipt) {
                  if (!receipt) return onTradeFailed(self.errors.TRANSACTION_RECEIPT_NOT_FOUND);
                  if (receipt.error) return onTradeFailed(receipt);
                  var cashFromTrade, tradingFees, logs, sig, logdata;
                  if (receipt && receipt.logs && receipt.logs.constructor === Array && receipt.logs.length) {
                    logs = receipt.logs;
                    sig = self.api.events.log_short_fill_tx.signature;
                    cashFromTrade = constants.ZERO;
                    tradingFees = constants.ZERO;
                    for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
                      if (logs[i].topics[0] === sig) {
                        logdata = self.rpc.unmarshal(logs[i].data);
                        if (logdata && logdata.constructor === Array && logdata.length > 8) {
                          cashFromTrade = cashFromTrade.plus(abi.unfix(abi.hex(logdata[8], true)).times(abi.unfix(logdata[1])));
                          tradingFees = tradingFees.plus(abi.unfix(logdata[5]));
                        }
                      }
                    }
                  }
                  cb({
                    hash: txHash,
                    unmatchedShares: abi.unfix(result.callReturn[1], "string"),
                    matchedShares: abi.unfix(abi.hex(result.callReturn[2], true), "string"),
                    cashFromTrade: abi.string(cashFromTrade),
                    price: abi.unfix(abi.hex(result.callReturn[3], true), "string"),
                    tradingFees: abi.string(tradingFees),
                    gasFees: result.gasFees,
                    timestamp: result.timestamp
                  });
                });
              } else {
                err = self.rpc.errorCodes("short_sell", "number", result.callReturn);
                if (!err) {
                  err = clone(self.errors.TRADE_FAILED);
                  err.message += result.callReturn.toString();
                  return onTradeFailed(result);
                }
                onTradeFailed({error: err, message: self.errors.short_sell[err], tx: tx});
              }
            };
            self.transact(tx, onTradeSent, utils.compose(prepare, onTradeSuccess), onTradeFailed);
          });
        },
        onFailed: onCommitFailed
      });
    });
  }
};
