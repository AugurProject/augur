/**
 * Logging/filter tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var async = require("async");
var locks = require("locks");
var assert = require("chai").assert;
var abi = require("augur-abi");
var spammer = require("spammer");
var api = new require("augur-contracts").Tx();
var tools = require("../../tools");
var constants = require("../../../src/constants");
var augurpath = "../../../src/index";

var DEBUG = false;
var DELAY = 2500;

var augur = tools.setup(require(augurpath), process.argv.slice(2));
var branch = constants.DEFAULT_BRANCH_ID;
var numMarkets = parseInt(augur.getNumMarketsBranch(branch), 10);
var markets = augur.getSomeMarketsInBranch(branch, numMarkets - 100, numMarkets);
var marketId = markets[markets.length - 1];
var tradeMarket = {};
tradeMarket[augur.getMarketInfo(marketId).type] = marketId;
var outcome = "1";
var amount = "1";
var password;
password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();

describe("Price history", function () {
  before(function (done) {
    this.timeout(tools.TIMEOUT*6);
    var augur = tools.setup(require(augurpath), process.argv.slice(2))
    if (parseInt(augur.getTotalSharesPurchased(marketId))) return done();
    var allAccounts = augur.rpc.accounts();
    tools.top_up(augur, branch, allAccounts, password, function (err, unlocked) {
      assert.isNull(err, JSON.stringify(err));
      assert.isArray(unlocked);
      assert.isAbove(unlocked.length, 1);
      tools.trade_in_each_market(augur, 1, tradeMarket, unlocked[0], unlocked[1], password, done);
    });
  });

  it("[async] getMarketPriceHistory(" + marketId + ")", function (done) {
    this.timeout(tools.TIMEOUT);
    var start = (new Date()).getTime();
    augur.getMarketPriceHistory(marketId, function (priceHistory) {
      if (DEBUG) console.log("[async] getMarketPriceHistory:", ((new Date()).getTime() - start) / 1000, "seconds");
      if (DEBUG) console.log("priceHistory:", priceHistory);
      assert.isObject(priceHistory);
      for (var k in priceHistory) {
        if (!priceHistory.hasOwnProperty(k)) continue;
        var logs = priceHistory[k];
        assert.isArray(logs);
      }
      done();
    });
  });

  it("[sync] getMarketPriceHistory(" + marketId + ")", function () {
    this.timeout(tools.TIMEOUT);
    var start = (new Date()).getTime();
    var priceHistory = augur.getMarketPriceHistory(marketId);
    if (DEBUG) console.log("[sync] getMarketPriceHistory:", ((new Date()).getTime() - start) / 1000, "seconds");
    assert.isObject(priceHistory);
    for (var k in priceHistory) {
      if (!priceHistory.hasOwnProperty(k)) continue;
      var logs = priceHistory[k];
      assert.isArray(logs);
    }
  });
});

describe("Account trade list", function () {
  var account = augur.coinbase;
  it("getAccountTrades(" + account + ")", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.getAccountTrades(account, function (trades) {
      for (var marketId in trades) {
        if (!trades.hasOwnProperty(marketId)) continue;
        for (var outcomeId in trades[marketId]) {
          if (!trades[marketId].hasOwnProperty(outcomeId)) continue;
          assert.isArray(trades[marketId][outcomeId]);
          for (var i = 0; i < trades[marketId][outcomeId].length; ++i) {
            assert.property(trades[marketId][outcomeId][i], "price");
            assert.property(trades[marketId][outcomeId][i], "type");
            assert.property(trades[marketId][outcomeId][i], "shares");
            assert.property(trades[marketId][outcomeId][i], "maker");
            assert.property(trades[marketId][outcomeId][i], "blockNumber");
            assert.isAbove(trades[marketId][outcomeId][i].blockNumber, 0);
          }
        }
      }
      done();
    });
  });
  it("meanTradePrice", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.getAccountTrades(account, function (trades) {
      var meanBuyPrice, meanSellPrice;
      for (var marketId in trades) {
        if (!trades.hasOwnProperty(marketId)) continue;
        meanBuyPrice = augur.meanTradePrice(trades[marketId]);
        meanSellPrice = augur.meanTradePrice(trades[marketId], true);
        for (var outcomeId in meanBuyPrice) {
          if (!meanBuyPrice.hasOwnProperty(outcomeId)) continue;
          assert.isAbove(abi.number(meanBuyPrice[outcomeId]), 0);
        }
        for (var outcomeId in meanSellPrice) {
          if (!meanSellPrice.hasOwnProperty(outcomeId)) continue;
          assert.isAbove(abi.number(meanSellPrice[outcomeId]), 0);
        }
      }
      done();
    });
  });
  it("getAccountMeanTradePrices(" + account + ")", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.getAccountMeanTradePrices(account, function (meanPrices) {
      for (var bs in meanPrices) {
        if (!meanPrices.hasOwnProperty(bs)) continue;
        for (var marketId in meanPrices[bs]) {
          if (!meanPrices[bs].hasOwnProperty(marketId)) continue;
          for (var outcomeId in meanPrices[bs][marketId]) {
            if (!meanPrices[bs][marketId].hasOwnProperty(outcomeId)) continue;
            assert.isAbove(abi.number(meanPrices[bs][marketId][outcomeId]), 0);
          }
        }
      }
      done();
    });
  });
});

describe("listen/ignore", function () {
  it("listen ignores invalid label", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.filters.listen({
      invalidFilterLabel: function (msg) {}
    }, function (filters) {
      done();
    });
  });
  it("listen doesn't hang on same label", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.filters.listen({
      marketCreated: {}
    }, function (filters) {
      var id = filters.marketCreated.id;
      augur.filters.listen({
        marketCreated: {}
      }, function (filters) {
        assert.notStrictEqual(id, filters.marketCreated.id);
        done();
      });
    });
  });
  it("block filter", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    augur.filters.listen({
      block: function (blockHash) {
        assert.strictEqual(blockHash.slice(0, 2), "0x");
        assert.strictEqual(blockHash.length, 66);
        assert.isNull(augur.filters.filter.contracts.heartbeat);
        if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
          assert.isNotNull(augur.filters.filter.block.heartbeat);
        }
        assert.isNull(augur.filters.filter.contracts.id);
        assert.isNotNull(augur.filters.filter.block.id);

                // stop heartbeat and tear down filters
        augur.filters.ignore(true, {
          block: function () {
            assert.isNull(augur.filters.filter.contracts.heartbeat);
            assert.isNull(augur.filters.filter.block.heartbeat);
            assert.isNull(augur.filters.filter.contracts.id);
            assert.isNull(augur.filters.filter.block.id);
            done();
          }
        });
      }
    });
  });
  it("contracts filter", function (done) {
    this.timeout(tools.TIMEOUT*3);
    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    augur.filters.listen({
      contracts: function (tx) {
        assert.property(tx, "address");
        assert.property(tx, "topics");
        assert.property(tx, "data");
        assert.property(tx, "blockNumber");
        assert.property(tx, "logIndex");
        assert.property(tx, "blockHash");
        assert.property(tx, "transactionHash");
        assert.property(tx, "transactionIndex");
        assert.isArray(tx.topics);
        assert.isArray(tx.data);
        assert.isAbove(parseInt(tx.blockNumber, 16), 0);
        assert.isNotNull(augur.filters.filter.contracts.id);
        assert.isAbove(parseInt(augur.filters.filter.contracts.id, 16), 0);

                // stop heartbeat
        augur.filters.ignore({
          contracts: function () {
            assert.isNull(augur.filters.filter.contracts.heartbeat);
            assert.isNull(augur.filters.filter.log_fill_tx.heartbeat);
            assert.isNull(augur.filters.filter.block.heartbeat);
            assert.isNotNull(augur.filters.filter.contracts.id);
            assert.isNull(augur.filters.filter.block.id);

                        // tear down filters
            augur.filters.ignore(true, {
              contracts: function () {
                assert.isNull(augur.filters.filter.contracts.heartbeat);
                assert.isNull(augur.filters.filter.block.heartbeat);
                assert.isNull(augur.filters.filter.contracts.id);
                assert.isNull(augur.filters.filter.block.id);
                done();
              }
            });
          }
        });
      }
    }, function (filters) {
      assert.isNotNull(filters.contracts.id);
      assert.strictEqual(filters.contracts.id, augur.filters.filter.contracts.id);
      spammer.createRandomMarket(augur, function (err, market) {
        if (DEBUG) console.debug("Random market created:", market);
        assert.isNull(err, JSON.stringify(err));
        assert.isNotNull(market);
      });
    });
  });
  it("log_fill_tx filter", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    var allAccounts = augur.rpc.accounts();
    tools.top_up(augur, branch, allAccounts, password, function (err, unlocked) {
      assert.isNull(err, JSON.stringify(err));
      assert.isArray(unlocked);
      assert.isAbove(unlocked.length, 1);
      augur.filters.listen({
        log_fill_tx: function (update) {
          // assert.property(update, "marketId");
          // assert.property(update, "outcome");
          // assert.property(update, "price");
          // assert.property(update, "blockNumber");
          // assert.isAbove(parseInt(update.blockNumber), 0);
          // assert.strictEqual(update.outcome, outcome);
          // assert(abi.bignum(update.trader).eq(abi.bignum(augur.coinbase)));
          // assert.isAbove(parseInt(augur.filters.filter.log_fill_tx.id), 0);
          assert.isNull(augur.filters.filter.contracts.heartbeat);
          if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
            assert.isNotNull(augur.filters.filter.log_fill_tx.heartbeat);
          }
          assert.isNull(augur.filters.filter.block.heartbeat);
          assert.isNull(augur.filters.filter.contracts.id);
          assert.isNotNull(augur.filters.filter.log_fill_tx.id);
          assert.isNull(augur.filters.filter.block.id);

                    // stop heartbeat and tear down filters
          augur.filters.ignore(true, {
            log_fill_tx: function () {
              assert.isNull(augur.filters.filter.contracts.heartbeat);
              assert.isNull(augur.filters.filter.log_fill_tx.heartbeat);
              assert.isNull(augur.filters.filter.block.heartbeat);
              assert.isNull(augur.filters.filter.contracts.id);
              assert.isNull(augur.filters.filter.log_fill_tx.id);
              assert.isNull(augur.filters.filter.block.id);
              done();
            }
          });
        }
      }, function (filters) {
        assert.isNotNull(filters.contracts.id);
        assert.strictEqual(filters.contracts.id, augur.filters.filter.contracts.id);
        tools.trade_in_each_market(augur, 1, tradeMarket, unlocked[0], unlocked[1], password, assert.isNull);
      });
    });
  });
  it("combined", function (done) {
    this.timeout(tools.TIMEOUT*10);
    var augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
    var setup = {
      block: null,
      contracts: null,
      log_fill_tx: null
    };
    var called_teardown = {
      block: false,
      contracts: false,
      log_fill_tx: false
    };

    // stop heartbeat and tear down filters
    function teardown(setup, done) {
      if (setup.log_fill_tx && setup.contracts && setup.block) {
        var mutex = locks.createMutex();
        mutex.lock(function () {
          augur.filters.ignore(true, {
            block: function () {
              assert.isNull(augur.filters.filter.block.heartbeat);
              assert.isNull(augur.filters.filter.block.id);
            },
            contracts: function () {
              assert.isNull(augur.filters.filter.contracts.heartbeat);
              assert.isNull(augur.filters.filter.contracts.id);
            },
            log_fill_tx: function () {
              assert.isNull(augur.filters.filter.log_fill_tx.heartbeat);
              assert.isNull(augur.filters.filter.log_fill_tx.id);
            }
          }, function (err) {
            mutex.unlock();
            if (err) return done(err);
            done();
          });
        });
      }
    }
    var allAccounts = augur.rpc.accounts();
    tools.top_up(augur, branch, allAccounts, password, function (err, unlocked) {
      assert.isNull(err, JSON.stringify(err));
      assert.isArray(unlocked);
      assert.isAbove(unlocked.length, 1);
      augur.filters.listen({
        block: function (blockHash) {
          assert.strictEqual(blockHash.slice(0, 2), "0x");
          assert.strictEqual(blockHash.length, 66);
          if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
            assert.isNotNull(augur.filters.filter.block.heartbeat);
          }
          assert.isNotNull(augur.filters.filter.block.id);
          if (!setup.block) {
            setup.block = true;
            teardown(setup, done);
          }
        },
        contracts: function (tx) {
          assert.property(tx, "address");
          assert.property(tx, "topics");
          assert.property(tx, "data");
          assert.property(tx, "blockNumber");
          assert.property(tx, "logIndex");
          assert.property(tx, "blockHash");
          assert.property(tx, "transactionHash");
          assert.property(tx, "transactionIndex");
          assert.isAbove(parseInt(tx.blockNumber), 0);
          assert.isAbove(parseInt(augur.filters.filter.contracts.id), 0);
          if (!setup.contracts) {
            setup.contracts = true;
            teardown(setup, done);
          }
        },
        log_fill_tx: function (update) {
          assert.isAbove(parseInt(augur.filters.filter.log_fill_tx.id), 0);
          if (!augur.rpc.wsUrl && !augur.rpc.ipcpath) {
            assert.isNotNull(augur.filters.filter.log_fill_tx.heartbeat);
          }
          assert.isNotNull(augur.filters.filter.log_fill_tx.id);
          if (!setup.log_fill_tx) {
            setup.log_fill_tx = true;
            teardown(setup, done);
          }
        }
      }, function (filters) {
        assert.isNotNull(filters.contracts.id);
        assert.strictEqual(filters.contracts.id, augur.filters.filter.contracts.id);
        tools.trade_in_each_market(augur, 1, tradeMarket, unlocked[0], unlocked[1], password, done);
        spammer.createRandomMarket(augur, function (err, market) {
          if (DEBUG) console.debug("Random market created:", market);
          assert.isNull(err, JSON.stringify(err));
          assert.isNotNull(market);
        });
      });
    });
  });
});
