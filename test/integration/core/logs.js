/**
 * Logging tests
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");
var constants = require("../../../src/constants");
var augurpath = "../../../src/index";

var DEBUG = false;
var DELAY = 2500;

var augur = tools.setup(require(augurpath));
var branch = constants.DEFAULT_BRANCH_ID;
var numMarkets = parseInt(augur.Branches.getNumMarketsBranch(branch), 10);
var markets = augur.Branches.getSomeMarketsInBranch(branch, numMarkets - 100, numMarkets);
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
    augur.getMarketPriceHistory(marketId, function (err, priceHistory) {
      assert.isNull(err);
      if (DEBUG) console.log("[async] getMarketPriceHistory:", ((new Date()).getTime() - start) / 1000, "seconds");
      if (DEBUG) console.log("priceHistory:", priceHistory);
      assert.isObject(priceHistory);
      for (var k in priceHistory) {
        if (priceHistory.hasOwnProperty(k)) {
          var logs = priceHistory[k];
          assert.isArray(logs);
        }
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
      if (priceHistory.hasOwnProperty(k)) {
        var logs = priceHistory[k];
        assert.isArray(logs);
      }
    }
  });
});

describe("Account trade list", function () {
  var account = augur.store.getState().coinbaseAddress;
  it("getAccountTrades(" + account + ")", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.getAccountTrades(account, function (trades) {
      for (var marketId in trades) {
        if (trades.hasOwnProperty(marketId)) {
          for (var outcomeId in trades[marketId]) {
            if (trades[marketId].hasOwnProperty(outcomeId)) {
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
        }
      }
      done();
    });
  });
});
