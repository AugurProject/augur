/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var clone = require("clone");
var augurpath = "../../../src/index";
var constants = require("../../../src/constants");
var utils = require("../../../src/utilities");
var tools = require("../../tools");
var random = require("../../random");
var errors = require("augur-contracts").errors;
var DEBUG = false;

describe("makeTradeHash", function () {
  var augur;
  before(function () {
    augur = tools.setup(require(augurpath), process.argv.slice(2));
  });
  var test = function (t) {
    it(JSON.stringify(t), function () {
      this.timeout(tools.TIMEOUT);
      var trade_ids = t.trade_ids || random.hashArray(t.numTrades || random.int(1, 100));
      var tradeHash = augur.makeTradeHash(t.max_value, t.max_amount, trade_ids);
      var contractTradeHash = augur.Trades.makeTradeHash({
        max_value: abi.fix(t.max_value, "hex"),
        max_amount: abi.fix(t.max_amount, "hex"),
        trade_ids: trade_ids
      });
      assert.strictEqual(tradeHash, contractTradeHash);
    });
  };
  test({max_value: 1, max_amount: 0, trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
  test({max_value: 0, max_amount: 1, trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
  test({max_value: 1, max_amount: 0, trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
  test({max_value: 0, max_amount: 1, trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
  test({max_value: 1, max_amount: 0, trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
  test({max_value: 0, max_amount: 1, trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
  test({max_value: "0x0", max_amount: "0x1", trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
  test({max_value: "0x1", max_amount: "0x0", trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
  test({max_value: "0x0", max_amount: "0x1", trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
  test({max_value: "0x1", max_amount: "0x0", trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
  test({max_value: "0x0", max_amount: "0x1", trade_ids: ["-0x4a79aafd3b316a3e02ae87368a79c2262bedc9c6cb58f8d05b452f6ce6f38796"]});
  test({max_value: "0x1", max_amount: "0x0", trade_ids: ["-0x4a79aafd3b316a3e02ae87368a79c2262bedc9c6cb58f8d05b452f6ce6f38796"]});
  test({max_value: "0x0", max_amount: "0x1", trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
  test({max_value: "0x1", max_amount: "0x0", trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
  for (var i = 1; i < 2; ++i) {
    for (var j = 1; j < 2; ++j) {
      for (var k = 1; k < 2; ++k) {
        test({max_value: i, max_amount: j, numTrades: k});
        test({max_value: i, max_amount: j});
        test({max_value: random.int(1, i), max_amount: random.int(1, j), numTrades: random.int(1, k)});
      }
    }
  }
});

describe("Trade", function () {

  var augur = tools.setup(require(augurpath), process.argv.slice(2));
  augur.options.debug.trading = DEBUG;
  var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
  var unlockable = augur.rpc.accounts();
  var markets = {
    binary: "0x602e5982a16fded3a298dc1cc202d777925b7a98c95a0a3c09c8bcc7d1f936eb",
    categorical: "0x339203020b1a79c893969394a55418a7e1b5a87f05d219701915cd03638e6f42",
    scalar: "0x6b23d0d9e8c82b83ad93b3f6d2c7a2e667fad53b65272cb798eeeefa3c34de90"
  };

  before("Top-up accounts and create new markets", function (done) {
    this.timeout(tools.TIMEOUT*unlockable.length + tools.TIMEOUT*3);
    tools.top_up(augur, null, unlockable, password, function (err, unlocked) {
      assert.isNull(err, JSON.stringify(err));
      assert.isArray(unlocked);
      assert.isAbove(unlocked.length, 0);
      unlockable = clone(unlocked);
      var expiration = parseInt(new Date().getTime() / 995);
      tools.create_each_market_type(augur, null, expiration, function (err, newMarkets) {
        assert.isNull(err, JSON.stringify(err));
        assert.isObject(newMarkets);
        assert.isString(newMarkets.binary);
        assert.isString(newMarkets.categorical);
        assert.isString(newMarkets.scalar);
        assert.isNotNull(augur.getMarketInfo(newMarkets.binary));
        assert.isNotNull(augur.getMarketInfo(newMarkets.categorical));
        assert.isNotNull(augur.getMarketInfo(newMarkets.scalar));
        markets = clone(newMarkets);
        done();
      });
    });
  });

  describe("trade.isUnderGasLimit", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        assert.strictEqual(augur.isUnderGasLimit(t.tradeTypes), t.expected);
        augur.isUnderGasLimit(t.tradeTypes, function (isUnderGasLimit) {
          assert.strictEqual(isUnderGasLimit, t.expected);
          augur.isUnderGasLimit(t.tradeTypes, null, function (isUnderGasLimit) {
            assert.strictEqual(isUnderGasLimit, t.expected);
            done();
          });
        });
      });
    };
    test({
      tradeTypes: ["buy"],
      expected: true
    });
    test({
      tradeTypes: ["sell", "buy"],
      expected: true
    });
    test({
      tradeTypes: ["buy", "buy", "sell"],
      expected: true
    });
    test({
      tradeTypes: ["sell", "buy", "sell", "buy"],
      expected: true
    });
    test({
      tradeTypes: ["buy", "sell", "sell", "buy", "buy"],
      expected: true
    });
    test({
      tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell"],
      expected: true
    });
    test({
      tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell", "sell"],
      expected: true
    });
    test({
      tradeTypes: ["buy", "buy", "buy", "buy", "buy", "buy", "buy"],
      expected: false
    });
  });

  describe("BuyAndSellShares.buy", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT);
        augur.get_total_trades(markets[t.market], function (initialTotalTrades) {
          initialTotalTrades = parseInt(initialTotalTrades);
          augur.buy({
            amount: t.amount,
            price: t.price,
            market: markets[t.market],
            outcome: t.outcome,
            onSent: function (r) {
              assert.isString(r.txHash);
              assert.isNull(r.callReturn);
            },
            onSuccess: function (r) {
              assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(r.callReturn));
              augur.get_trade(r.callReturn, function (trade) {
                assert.isObject(trade);
                assert.approximately(Number(trade.amount), Number(t.amount), tools.EPSILON);
                assert.approximately(Number(trade.price), Number(t.price), tools.EPSILON);
                assert.strictEqual(abi.format_int256(trade.market), markets[t.market]);
                assert.strictEqual(trade.outcome, t.outcome);
                augur.get_total_trades(markets[t.market], function (totalTrades) {
                  assert.isAbove(parseInt(totalTrades), initialTotalTrades);
                  done();
                });
              });
            },
            onFailed: done
          });
        });
      });
    };
    test({
      market: "binary",
      amount: 1,
      price: "0.5",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "0.25",
      price: "0.52",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "1.5",
      price: "0.1",
      outcome: "2"
    });
    test({
      market: "categorical",
      amount: 1,
      price: "0.5",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "0.25",
      price: "0.52",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "1.5",
      price: "0.1",
      outcome: "7"
    });
    test({
      market: "scalar",
      amount: 1,
      price: "2.5",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "0.25",
      price: "2.6",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "1.5",
      price: "1.2",
      outcome: "2"
    });
  });

  describe("BuyAndSellShares.sell", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT);
        var initShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
        augur.buyCompleteSets({
          market: markets[t.market],
          amount: t.amount,
          onSent: function (r) {
            assert.isNull(r.callReturn);
          },
          onSuccess: function (r) {
            var finalShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
            assert.strictEqual(parseFloat(finalShares - initShares), parseFloat(t.amount));
            augur.get_total_trades(markets[t.market], function (initialTotalTrades) {
              initialTotalTrades = parseInt(initialTotalTrades);
              augur.sell({
                amount: t.amount,
                price: t.price,
                market: markets[t.market],
                outcome: t.outcome,
                onSent: function (r) {
                  assert.isString(r.txHash);
                  assert.isNull(r.callReturn);
                },
                onSuccess: function (r) {
                  assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(r.callReturn));
                  augur.get_trade(r.callReturn, function (trade) {
                    assert.isObject(trade);
                    assert.approximately(Number(trade.amount), Number(t.amount), tools.EPSILON);
                    assert.approximately(Number(trade.price), Number(t.price), tools.EPSILON);
                    assert.strictEqual(abi.format_int256(trade.market), markets[t.market]);
                    assert.strictEqual(trade.outcome, t.outcome);
                    augur.get_total_trades(markets[t.market], function (totalTrades) {
                      assert.isAbove(parseInt(totalTrades), initialTotalTrades);
                      done();
                    });
                  });
                },
                onFailed: done
              });
            });
          },
          onFailed: done
        });
      });
    };
    test({
      market: "binary",
      amount: 1,
      price: "0.5",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "0.25",
      price: "0.52",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "1.5",
      price: "0.9",
      outcome: "2"
    });
    test({
      market: "categorical",
      amount: 1,
      price: "0.5",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "0.25",
      price: "0.52",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "1.5",
      price: "0.9",
      outcome: "7"
    });
    test({
      market: "scalar",
      amount: 1,
      price: "2.5",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "0.25",
      price: "2.6",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "1.5",
      price: "1.2",
      outcome: "2"
    });
  });

  describe("BuyAndSellShares.cancel", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT);
        augur.buyCompleteSets({
          market: markets[t.market],
          amount: t.amount,
          onSent: utils.noop,
          onSuccess: function (r) {
            augur.sell({
              amount: t.amount,
              price: t.price,
              market: markets[t.market],
              outcome: t.outcome,
              onSent: function (r) {
                assert(r.txHash);
                assert.isNull(r.callReturn);
              },
              onSuccess: function (r) {
                assert(r.hash);
                assert.isNotNull(r.callReturn);
                assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(r.callReturn));
                augur.cancel(r.callReturn, function (r) {
                  assert.isNull(r.callReturn);
                }, function (r) {
                  assert(r.hash);
                  assert.strictEqual(r.callReturn, "1");
                  done();
                }, done);
              },
              onFailed: done
            });
          },
          onFailed: done
        });
      });
    };
    test({
      market: "binary",
      amount: 1,
      price: "0.5",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "0.25",
      price: "0.52",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "1.5",
      price: "0.1",
      outcome: "2"
    });
    test({
      market: "categorical",
      amount: 1,
      price: "0.5",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "0.25",
      price: "0.52",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "1.5",
      price: "0.1",
      outcome: "7"
    });
    test({
      market: "scalar",
      amount: 1,
      price: "2.5",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "0.25",
      price: "2.6",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "1.5",
      price: "1.2",
      outcome: "2"
    });
  });

  describe("Trade.trade", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT*3);
        var active = augur.from;
        augur.rpc.personal("unlockAccount", [unlockable[0], password]);
        augur.rpc.personal("unlockAccount", [unlockable[1], password]);
        augur.useAccount(unlockable[0]);
        if (t.type === "buy") {
          augur.buyCompleteSets({
            market: markets[t.market],
            amount: t.amount,
            onSent: utils.noop,
            onSuccess: function (r) {
              augur.sell({
                amount: t.amount,
                price: t.price,
                market: markets[t.market],
                outcome: t.outcome,
                onSent: utils.noop,
                onSuccess: function (r) {
                  var new_trade_id = r.callReturn;
                  augur.useAccount(unlockable[1]);
                  var trade_ids = augur.get_trade_ids(markets[t.market]);
                  assert.include(trade_ids, abi.hex(new_trade_id));
                                    // var orderBook = augur.getOrderBook(markets[t.market]);
                                    // console.log("[before] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                  var tradingFee = augur.getTradingFee(markets[t.market]);
                  var makerProportionOfFee = augur.getMakerFees(markets[t.market]);
                  var cost = augur.calculateFxpTradingCost(t.amount, t.price, abi.fix(tradingFee), abi.fix(makerProportionOfFee), augur.getCumScale(markets[t.market])).cost.toFixed();
                  augur.trade({
                    max_value: cost,
                    max_amount: 0,
                    trade_ids: [new_trade_id],
                    sender: unlockable[1],
                    onTradeHash: function (r) {
                      assert.notProperty(r, "error");
                      assert.isString(r);
                    },
                    onCommitSent: function (r) {
                      assert.strictEqual(r.callReturn, "1");
                    },
                    onCommitSuccess: function (r) {
                      assert.strictEqual(r.callReturn, "1");
                    },
                    onCommitFailed: function (e) {
                      augur.useAccount(active);
                      console.error(e);
                      assert.isNull(e);
                    },
                    onTradeSent: function (r) {
                      assert.isNull(r.callReturn);
                    },
                    onTradeSuccess: function (r) {
                                            // console.log("trade success:", r);
                                            // var orderBook = augur.getOrderBook(markets[t.market]);
                                            // console.log("[after] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                      assert.isObject(r);
                      assert.notProperty(r, "error");
                      assert.property(r, "unmatchedCash");
                      assert.property(r, "unmatchedShares");
                      assert.property(r, "sharesBought");
                      assert.property(r, "cashFromTrade");
                      assert.property(r, "tradingFees");
                      assert.property(r, "gasFees");
                      assert.isAtMost(abi.number(r.unmatchedCash), t.expected.unmatchedCash);
                      assert.strictEqual(abi.number(r.unmatchedShares), t.expected.unmatchedShares);
                      assert.isAtMost(abi.number(r.sharesBought), t.expected.sharesBought);
                      assert.strictEqual(abi.number(r.cashFromTrade), t.expected.cashFromTrade);
                      assert.isNull(augur.get_trade(new_trade_id));
                      assert.notProperty(augur.getOrderBook(markets[t.market]).sell, new_trade_id);
                      augur.useAccount(active);
                      done();
                    },
                    onTradeFailed: function (e) {
                      augur.useAccount(active);
                      console.error(JSON.stringify(e, null, 2));
                      assert.isNull(e);
                    }
                  });
                },
                onFailed: function (e) {
                  augur.useAccount(active);
                  console.error(JSON.stringify(e, null, 2));
                  assert.isNull(e);
                }
              });
            },
            onFailed: function (e) {
              augur.useAccount(active);
              console.error(JSON.stringify(e, null, 2));
              assert.isNull(e);
            }
          });
        } else {
          augur.buy({
            amount: t.amount,
            price: t.price,
            market: markets[t.market],
            outcome: t.outcome,
            onSent: utils.noop,
            onSuccess: function (r) {
              var new_trade_id = r.callReturn;
              augur.useAccount(unlockable[1]);
              augur.buyCompleteSets({
                market: markets[t.market],
                amount: t.amount,
                onSent: utils.noop,
                onSuccess: function (r) {
                  var trade_ids = augur.get_trade_ids(markets[t.market]);
                  assert.include(trade_ids, abi.hex(new_trade_id));
                  // var orderBook = augur.getOrderBook(markets[t.market]);
                  // console.log("[before] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                  augur.trade({
                    max_value: 0,
                    max_amount: t.amount,
                    trade_ids: [new_trade_id],
                    onTradeHash: function (r) {
                      assert.notProperty(r, "error");
                      assert.isString(r);
                    },
                    onCommitSent: function (r) {
                      assert.strictEqual(r.callReturn, "1");
                    },
                    onCommitSuccess: function (r) {
                      assert.strictEqual(r.callReturn, "1");
                    },
                    onCommitFailed: function (e) {
                      augur.useAccount(active);
                      console.error(JSON.stringify(e, null, 2));
                      assert.isNull(e);
                    },
                    onTradeSent: function (r) {
                      assert.isNull(r.callReturn);
                    },
                    onTradeSuccess: function (r) {
                      // console.log("trade success:", r);
                      // var orderBook = augur.getOrderBook(markets[t.market]);
                      // console.log("[after] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                      assert.isObject(r);
                      assert.notProperty(r, "error");
                      assert.property(r, "unmatchedCash");
                      assert.property(r, "unmatchedShares");
                      assert.property(r, "sharesBought");
                      assert.property(r, "cashFromTrade");
                      assert.property(r, "tradingFees");
                      assert.property(r, "gasFees");
                      assert.isAtMost(abi.number(r.unmatchedCash), t.expected.unmatchedCash);
                      assert.strictEqual(abi.number(r.unmatchedShares), t.expected.unmatchedShares);
                      assert.strictEqual(abi.number(r.sharesBought), t.expected.sharesBought);
                      assert.strictEqual(abi.number(r.cashFromTrade), t.expected.cashFromTrade);
                      assert.isNull(augur.get_trade(new_trade_id));
                      assert.notProperty(augur.getOrderBook(markets[t.market]).buy, new_trade_id);
                      augur.useAccount(active);
                      done();
                    },
                    onTradeFailed: function (e) {
                      augur.useAccount(active);
                      console.error(JSON.stringify(e, null, 2));
                      assert.isNull(e);
                    }
                  });
                },
                onFailed: function (e) {
                  augur.useAccount(active);
                  console.error(JSON.stringify(e, null, 2));
                  assert.isNull(e);
                }
              });
            },
            onFailed: function (e) {
              augur.useAccount(active);
              console.error(JSON.stringify(e, null, 2));
              assert.isNull(e);
            }
          });
        }
      });
    };
    test({
      type: "buy",
      market: "binary",
      amount: 1,
      outcome: "1",
      price: "0.1",
      expected: {
        unmatchedCash: 0.9,
        unmatchedShares: 0,
        sharesBought: 1,
        cashFromTrade: 0
      }
    });
    test({
      type: "sell",
      market: "binary",
      amount: 1,
      outcome: "1",
      price: "0.1",
      expected: {
        unmatchedCash: 0.9,
        unmatchedShares: 0,
        sharesBought: 0,
        cashFromTrade: 0.1
      }
    });
    test({
      type: "buy",
      market: "categorical",
      amount: 2,
      outcome: "3",
      price: "0.1",
      expected: {
        unmatchedCash: 1.8,
        unmatchedShares: 0,
        sharesBought: 2,
        cashFromTrade: 0
      }
    });
    test({
      type: "sell",
      market: "categorical",
      amount: 2,
      outcome: "3",
      price: "0.1",
      expected: {
        unmatchedCash: 0.9,
        unmatchedShares: 0,
        sharesBought: 0,
        cashFromTrade: 0.2
      }
    });
    test({
      type: "buy",
      market: "scalar",
      amount: 1,
      outcome: "1",
      price: "3.4",
      expected: {
        unmatchedCash: 0,
        unmatchedShares: 0,
        sharesBought: 1,
        cashFromTrade: 0
      }
    });
    test({
      type: "sell",
      market: "scalar",
      amount: 1,
      outcome: "1",
      price: "3.4",
      expected: {
        unmatchedCash: 0,
        unmatchedShares: 0,
        sharesBought: 0,
        cashFromTrade: 3.4
      }
    });
  });

  describe("Trade.short_sell", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT*3);
        var active = augur.from;
        augur.rpc.personal("unlockAccount", [unlockable[0], password]);
        augur.rpc.personal("unlockAccount", [unlockable[1], password]);
        augur.useAccount(unlockable[0]);
        augur.buy({
          amount: t.amount,
          price: t.price,
          market: markets[t.market],
          outcome: t.outcome,
          onSent: utils.noop,
          onSuccess: function (r) {
            var new_trade_id = r.callReturn;
            augur.useAccount(unlockable[1]);
            var trade_ids = augur.get_trade_ids(markets[t.market]);
            assert.include(trade_ids, abi.hex(new_trade_id));
            // var orderBook = augur.getOrderBook(markets[t.market]);
            // console.log("[before] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
            augur.short_sell({
              buyer_trade_id: new_trade_id,
              max_amount: t.amount,
              sender: unlockable[1],
              onTradeHash: function (r) {
                assert.notProperty(r, "error");
                assert.isString(r);
              },
              onCommitSent: function (r) {
                assert.strictEqual(r.callReturn, "1");
              },
              onCommitSuccess: function (r) {
                assert.strictEqual(r.callReturn, "1");
              },
              onCommitFailed: function (e) {
                augur.useAccount(active);
                done(e);
              },
              onTradeSent: function (r) {
                assert.isNull(r.callReturn);
              },
              onTradeSuccess: function (r) {
                // console.log("short_sell success:", r);
                // var orderBook = augur.getOrderBook(markets[t.market]);
                // console.log("[after] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                assert.isObject(r);
                assert.notProperty(r, "error");
                assert.property(r, "matchedShares");
                assert.property(r, "unmatchedShares");
                assert.property(r, "cashFromTrade");
                assert.property(r, "tradingFees");
                assert.property(r, "gasFees");
                assert.property(r, "price");
                assert.strictEqual(abi.number(r.matchedShares), t.expected.matchedShares);
                assert.strictEqual(abi.number(r.unmatchedShares), t.expected.unmatchedShares);
                assert.strictEqual(abi.number(r.cashFromTrade), t.expected.cashFromTrade);
                assert.strictEqual(abi.number(r.price), t.expected.price);
                augur.useAccount(active);
                done();
              },
              onTradeFailed: function (e) {
                augur.useAccount(active);
                done(e);
              }
            });
          },
          onFailed: function (e) {
            augur.useAccount(active);
            done(e);
          }
        });
      });
    };
    test({
      market: "binary",
      amount: 1,
      outcome: "1",
      price: "0.1",
      expected: {
        unmatchedShares: 0,
        matchedShares: 1,
        cashFromTrade: 0.1,
        price: 0.1
      }
    });
    test({
      market: "categorical",
      amount: 2,
      outcome: "3",
      price: "0.1",
      expected: {
        unmatchedShares: 0,
        matchedShares: 2,
        cashFromTrade: 0.2,
        price: 0.1
      }
    });
    test({
      market: "scalar",
      amount: 1,
      outcome: "1",
      price: "3.4",
      expected: {
        unmatchedShares: 0,
        matchedShares: 1,
        cashFromTrade: 3.4,
        price: 3.4
      }
    });
  });

  describe("BuyAndSellShares.shortAsk", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT);
        var initShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
        var initialTotalTrades = parseInt(augur.get_total_trades(markets[t.market]));
        augur.shortAsk({
          amount: t.amount,
          price: t.price,
          market: markets[t.market],
          outcome: t.outcome,
          onSent: function (r) {
            assert.isNull(r.callReturn);
          },
          onSuccess: function (r) {
            assert.isNotNull(r.callReturn);
            var tradeID = r.callReturn;
            var finalShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
            assert.strictEqual(parseFloat(finalShares - initShares), 0);
            assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(tradeID));
            var trade = augur.get_trade(tradeID);
            assert.isObject(trade);
            assert.approximately(Number(trade.amount), Number(t.amount), tools.EPSILON);
            assert.approximately(Number(trade.price), Number(t.price), tools.EPSILON);
            assert.strictEqual(abi.format_int256(trade.market), markets[t.market]);
            assert.strictEqual(trade.outcome, t.outcome);
            var totalTrades = parseInt(augur.get_total_trades(markets[t.market]));
            assert.isAbove(totalTrades, initialTotalTrades);
            done();
          },
          onFailed: function (e) {
            console.error(JSON.stringify(e, null, 2));
            assert.isNull(e);
          }
        });
      });
    };
    test({
      market: "binary",
      amount: 1,
      price: "0.5",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "0.25",
      price: "0.52",
      outcome: "1"
    });
    test({
      market: "binary",
      amount: "1.5",
      price: "0.9",
      outcome: "2"
    });
    test({
      market: "categorical",
      amount: 1,
      price: "0.5",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "0.25",
      price: "0.52",
      outcome: "3"
    });
    test({
      market: "categorical",
      amount: "1.5",
      price: "0.9",
      outcome: "7"
    });
    test({
      market: "scalar",
      amount: 1,
      price: "2.5",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "0.25",
      price: "2.6",
      outcome: "1"
    });
    test({
      market: "scalar",
      amount: "1.5",
      price: "1.2",
      outcome: "2"
    });
  });
});
