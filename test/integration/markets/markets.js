/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var async = require("async");
var assert = require("chai").assert;
var abi = require("augur-abi");
var clone = require("clone");
var utils = require("../../../src/utilities");
var contracts = require("augur-contracts");
var constants = require("../../../src/constants");
var augurpath = "../../../src/index";
var tools = require("../../tools");

var augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
var amount = "1";
var branchID = augur.constants.DEFAULT_BRANCH_ID;
var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
var traderIndex = "1";
var outcome = 1;
var numMarkets = parseInt(augur.getNumMarketsBranch(branchID), 10);
var markets = augur.getSomeMarketsInBranch(branchID, numMarkets - 100, numMarkets);
var numMarkets = markets.length;
var marketId = tools.select_random(markets);
if (numMarkets > tools.MAX_TEST_SAMPLES) {
  var randomMarkets = [];
  numMarkets = tools.MAX_TEST_SAMPLES;
  do {
    if (randomMarkets.indexOf(marketId) === -1) {
      randomMarkets.push(marketId);
    }
    marketId = tools.select_random(markets);
  } while (randomMarkets.length < tools.MAX_TEST_SAMPLES);
  markets = randomMarkets;
}
tools.TIMEOUT *= 2;

var errorCheck = function (output, done) {
  done = done || utils.pass;
  if (output && output.constructor === Object && output.error) {
    return done(new Error(JSON.stringify(output)));
  }
  return {output: output, done: done};
};

var runtests = function (method, test) {
  var arglen = arguments.length;
  var params = new Array(arglen - 2);
  if (params.length) {
    for (var i = 2; i < arglen; ++i) {
      params[i - 2] = arguments[i];
    }
  }
  describe(params.toString(), function () {
    it("async", function (done) {
      this.timeout(tools.TIMEOUT);
      augur[method].apply(augur, params.concat(function (output) {
        test(errorCheck(output, done));
      }));
    });
    it("sync", function (done) {
      this.timeout(tools.TIMEOUT);
      var output = augur[method].apply(augur, params);
      test(errorCheck(output, done));
    });
    if (augur.tx.Markets[method] && !augur.rpc.wsUrl) {
      it("batch", function (done) {
        this.timeout(tools.TIMEOUT);
        var batch = augur.createBatch();
        batch.add(method, params, function (output) {
          test(errorCheck(output));
        });
        batch.add(method, params, function (output) {
          test(errorCheck(output, done));
        });
        batch.execute();
      });
    }
  });
};
describe("getNumEvents", function () {
  var test = function (t) {
    var output = parseInt(t.output);
    assert.isNumber(output);
    assert.isAbove(output, 0);
    assert.isBelow(output, 4);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
describe("getBranchID", function () {
  var test = function (t) {
    assert.strictEqual(abi.hex(t.output), abi.hex(augur.constants.DEFAULT_BRANCH_ID));
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
describe("getMarketNumOutcomes", function () {
  var test = function (t) {
    assert.isAbove(parseInt(t.output), 1);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
describe("getParticipantSharesPurchased", function () {
  var test = function (t) {
    tools.gteq0(t.output);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i], traderIndex, outcome);
  }
});
describe("getSharesPurchased", function () {
  var test = function (t) {
    tools.gteq0(t.output);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i], outcome);
  }
});
describe("getWinningOutcomes", function () {
  var test = function (t) {
    assert.isArray(t.output);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
describe("getCumScale", function () {
  var test = function (t) {
    assert.isAbove(abi.number(t.output), 0);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
describe("getTradingPeriod", function () {
  var test = function (t) {
    assert.isAbove(abi.number(t.output), -2);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
describe("getTradingFee", function () {
  var test = function (t) {
    var output = t.output;
    assert.isAbove(abi.number(output), 0);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
