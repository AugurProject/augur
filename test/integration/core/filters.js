/**
 * Filters tests
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var async = require("async");
var locks = require("locks");
var assert = require("chai").assert;
var abi = require("augur-abi");
var api = new require("augur-contracts").Tx();
var tools = require("../../tools");
var constants = require("../../../src/constants");
var augurpath = "../../../src/index";

var DEBUG = false;
var DELAY = 2500;

var augur = tools.setup(require(augurpath));
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

describe("filters", function () {
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
  it("block filter (polling)", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath));
    augur.filters.listen({
      block: function (blockHash) {
        console.log('filters in block:', augur.filters.filter);
        assert.strictEqual(blockHash.slice(0, 2), "0x");
        assert.strictEqual(blockHash.length, 66);
        assert.isNotNull(augur.filters.filter.block.heartbeat);
        assert.isNotNull(augur.filters.filter.block.id);

        // stop heartbeat and tear down filters
        augur.filters.ignore(true, {
          block: function () {
            assert.isNull(augur.filters.filter.block.heartbeat);
            assert.isNull(augur.filters.filter.block.id);
            done();
          }
        });
      }
    });
  });
  it("log_fill_tx filter (polling)", function (done) {
    this.timeout(tools.TIMEOUT);
    var augur = tools.setup(require(augurpath));
    var allAccounts = augur.rpc.accounts();
    tools.top_up(augur, branch, allAccounts, password, function (err, unlocked) {
      assert.isNull(err, JSON.stringify(err));
      assert.isArray(unlocked);
      assert.isAbove(unlocked.length, 1);
      augur.filters.listen({
        log_fill_tx: function (update) {
          console.log('filters in log_fill_tx:', augur.filters.filter);
          assert.isNotNull(augur.filters.filter.log_fill_tx.heartbeat);
          assert.isNull(augur.filters.filter.block.heartbeat);
          assert.isNotNull(augur.filters.filter.log_fill_tx.id);
          assert.isNull(augur.filters.filter.block.id);

          // stop heartbeat and tear down filters
          augur.filters.ignore(true, {
            log_fill_tx: function () {
              assert.isNull(augur.filters.filter.log_fill_tx.heartbeat);
              assert.isNull(augur.filters.filter.block.heartbeat);
              assert.isNull(augur.filters.filter.log_fill_tx.id);
              assert.isNull(augur.filters.filter.block.id);
              done();
            }
          });
        }
      }, function (filters) {
        tools.trade_in_each_market(augur, 1, tradeMarket, unlocked[0], unlocked[1], password, assert.isNull);
      });
    });
  });
  it("combined", function (done) {
    this.timeout(tools.TIMEOUT*10);
    var augur = tools.setup(require(augurpath));
    var setup = {
      block: null,
      log_fill_tx: null
    };
    var called_teardown = {
      block: false,
      log_fill_tx: false
    };

    // stop heartbeat and tear down filters
    function teardown(setup, done) {
      if (setup.log_fill_tx && setup.block) {
        var mutex = locks.createMutex();
        mutex.lock(function () {
          augur.filters.ignore(true, {
            block: function () {
              assert.isNull(augur.filters.filter.block.heartbeat);
              assert.isNull(augur.filters.filter.block.id);
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
          if (!augur.subscriptionsSupported) {
            assert.isNotNull(augur.filters.filter.block.heartbeat);
          }
          assert.isNotNull(augur.filters.filter.block.id);
          if (!setup.block) {
            setup.block = true;
            teardown(setup, done);
          }
        },
        log_fill_tx: function (update) {
          assert.isAbove(parseInt(augur.filters.filter.log_fill_tx.id), 0);
          if (!augur.subscriptionsSupported) {
            assert.isNotNull(augur.filters.filter.log_fill_tx.heartbeat);
          }
          assert.isNotNull(augur.filters.filter.log_fill_tx.id);
          if (!setup.log_fill_tx) {
            setup.log_fill_tx = true;
            teardown(setup, done);
          }
        }
      }, function (filters) {
        tools.trade_in_each_market(augur, 1, tradeMarket, unlocked[0], unlocked[1], password, done);
      });
    });
  });
});
