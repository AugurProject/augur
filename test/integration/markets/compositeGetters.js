/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var clone = require("clone");
var utils = require("../../../src/utilities");
var augurpath = "../../../src/index";
var tools = require("../../tools");

var augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));

var amount = "1";
var branchID = augur.constants.DEFAULT_BRANCH_ID;
var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
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
        test(errorCheck(output, done), params);
      }));
    });
    it("sync", function (done) {
      this.timeout(tools.TIMEOUT);
      var output = augur[method].apply(augur, params);
      test(errorCheck(output, done), params);
    });
  });
};

var testMarketInfo = function (market, info) {
  var r;
  assert(info.constructor === Array || info.constructor === Object);
  if (info.constructor === Array) {
    assert.isAbove(info.length, 43);
    info = augur.rpc.encodeResult(info);
    assert.strictEqual(parseInt(info[7]), parseInt(branchID));
    r = augur.parseMarketInfo(info);
    if (r.numEvents > 1) {
      var txList = new Array(r.numEvents);
      for (var i = 0; i < r.numEvents; ++i) {
        txList[i] = tools.copy(augur.tx.getDescription);
        txList[i].params = r.events[i].id;
      }
      var response = augur.rpc.batch(txList);
      for (i = 0; i < response.length; ++i) {
        r.events[i].description = response[i];
      }
    }
  } else {
    r = info;
  }
  assert.isObject(r);
  assert.property(r, "network");
  assert(r.network === "7" || r.network === "10101" || r.network === "2");
  assert.property(r, "makerFee");
  assert.isNotNull(r.makerFee);
  assert.property(r, "takerFee");
  assert.isNotNull(r.takerFee);
  assert.property(r, "tradingFee");
  assert.isNotNull(r.tradingFee);
  assert.property(r, "tags");
  assert.isNotNull(r.tags);
  assert.property(r, "numOutcomes");
  assert.isAbove(r.numOutcomes, 1);
  assert.strictEqual(parseInt(augur.getMarketNumOutcomes(market)), r.numOutcomes);
  assert.property(r, "tradingPeriod");
  assert.isNumber(r.tradingPeriod);
  assert.strictEqual(parseInt(augur.getTradingPeriod(market)), r.tradingPeriod);
  assert.property(r, "branchId");
  assert.strictEqual(parseInt(augur.getBranchID(market)), parseInt(r.branchId));
  assert.property(r, "numEvents");
  assert.strictEqual(parseInt(augur.getNumEvents(market)), r.numEvents);
  assert.property(r, "cumulativeScale");
  assert.property(r, "creationFee");
  assert.strictEqual(augur.getCreationFee(market), r.creationFee);
  assert.property(r, "author");
  assert.strictEqual(augur.getCreator(market), r.author);
  assert.property(r, "endDate");
  assert.property(r, "outcomes");
  assert.isArray(r.outcomes);
  assert.isAbove(r.outcomes.length, 1);
  for (var i = 0, len = r.outcomes.length; i < len; ++i) {
    assert.property(r.outcomes[i], "id");
    assert.isNumber(r.outcomes[i].id);
    assert.property(r.outcomes[i], "outstandingShares");
    assert(abi.number(r.outcomes[i].outstandingShares) >= 0);
  }
  assert.property(r, "events");
  assert.isArray(r.events);
  assert.isAbove(r.events.length, 0);
  var marketEvents = augur.getMarketEvents(market);
  assert.strictEqual(marketEvents.length, r.events.length);
  for (var i = 0, len = r.events.length; i < len; ++i) {
    assert.isObject(r.events[i]);
    assert.property(r.events[i], "id");
    assert.strictEqual(marketEvents[i], r.events[i].id);
    assert.property(r.events[i], "endDate");
    assert.isAbove(r.events[i].endDate, 0);
    assert.property(r.events[i], "outcome");
    assert.isNotNull(r.events[i].outcome);
    assert.property(r.events[i], "minValue");
    assert.isNotNull(r.events[i].minValue);
    assert.property(r.events[i], "maxValue");
    assert.isNotNull(r.events[i].maxValue);
    assert.property(r.events[i], "numOutcomes");
    assert.isAbove(parseInt(r.events[i].numOutcomes), 1);
  }
};

before(function () {
  augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
});
describe("getMarketInfo", function () {
  var test = function (t, params) {
    testMarketInfo(params[0], t.output);
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
describe("batchGetMarketInfo", function () {
  var test = function (t, params) {
    for (var market in t.output) {
      if (!t.output.hasOwnProperty(market)) continue;
      testMarketInfo(market, t.output[market]);
    }
    t.done();
  };
  runtests(this.title, test, markets);
});
describe("getMarketsInfo", function () {
  var test = function (info, options, done) {
    if (utils.is_function(options) && !done) {
      done = options;
      options = undefined;
    }
    options = options || {};
    assert.isObject(info);
    var numMarkets = options.numMarkets || parseInt(augur.getNumMarketsBranch(branchID));
    var market;
    assert.strictEqual(Object.keys(info).length, numMarkets);
    for (var marketId in info) {
      if (!info.hasOwnProperty(marketId)) continue;
      market = info[marketId];
      assert.isNumber(market.tradingPeriod);
      assert.isString(market.tradingFee);
      assert.isString(market.makerFee);
      assert.isString(market.takerFee);
      assert.isNumber(market.creationTime);
      assert.isString(market.volume);
      assert.isArray(market.tags);
      assert.isNumber(market.endDate);
      assert.isString(market.description);
    }
    if (done) done();
  };
  var params = {
    branch: branchID,
    offset: 0,
    numMarketsToLoad: 3
  };
  it("sync", function () {
    this.timeout(tools.TIMEOUT);
    test(augur.getMarketsInfo(params), {numMarkets: params.numMarketsToLoad});
  });
  it("sync/missing offset", function () {
    this.timeout(tools.TIMEOUT);
    var p = tools.copy(params);
    delete p.offset;
    test(augur.getMarketsInfo(p), {numMarkets: p.numMarketsToLoad});
  });
  it("async", function (done) {
    this.timeout(tools.TIMEOUT);
    params.callback = function (info) {
      if (info.error) return done(info);
      test(info, {numMarkets: params.numMarketsToLoad}, done);
    };
    augur.getMarketsInfo(params);
  });
  it("async/offset=1/numMarketsToLoad=2", function (done) {
    this.timeout(tools.TIMEOUT);
    var numMarketsToLoad = 3;
    augur.getMarketsInfo({
      branch: branchID,
      offset: 1,
      numMarketsToLoad: numMarketsToLoad,
      callback: function (info) {
        if (info.error) return done(info);
        assert.strictEqual(Object.keys(info).length, numMarketsToLoad);
        test(info, {numMarkets: numMarketsToLoad}, done);
      }
    });
  });
});
describe("shrink/expandScalarPrice", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var smallPrice = augur.shrinkScalarPrice(t.minValue, t.price);
      assert.strictEqual(smallPrice, t.expected);
      assert.strictEqual(augur.expandScalarPrice(t.minValue, smallPrice), t.price);
      assert.isAtMost(parseFloat(smallPrice), abi.bignum(t.maxValue).minus(abi.bignum(t.minValue)).toNumber());
    });
  };
  test({
    maxValue: "10",
    minValue: "5",
    price: "10",
    expected: "5"
  });
  test({
    maxValue: "10",
    minValue: "5",
    price: "5",
    expected: "0"
  });
  test({
    maxValue: "10",
    minValue: "5",
    price: "7.5",
    expected: "2.5"
  });
  test({
    maxValue: "5",
    minValue: "-3",
    price: "4",
    expected: "7"
  });
  test({
    maxValue: "4",
    minValue: "-12",
    price: "3",
    expected: "15"
  });
  test({
    maxValue: "-2",
    minValue: "-3",
    price: "-2.1",
    expected: "0.9"
  });
  test({
    maxValue: "0",
    minValue: "-1000",
    price: "-10",
    expected: "990"
  });
  test({
    maxValue: "50000",
    minValue: "2000",
    price: "2001",
    expected: "1"
  });
});
describe("getOrderBook", function () {
  var test = function (t) {
    var marketInfo;
    assert.isObject(t.output);
    for (var type in t.output) {
      if (!t.output.hasOwnProperty(type)) continue;
      assert.isObject(t.output[type]);
      for (var orderId in t.output[type]) {
        if (!t.output[type].hasOwnProperty(orderId)) continue;
        var order = t.output[type][orderId];
        marketInfo = augur.getMarketInfo(order.market);
        assert.isNotNull(marketInfo);
        assert.isString(marketInfo.type);
        assert.strictEqual(type, order.type);
        assert.isString(order.id);
        assert.isString(order.market);
        assert.isString(order.amount);
        assert.isString(order.price);
        assert.isString(order.owner);
        assert.strictEqual(order.owner, abi.format_address(order.owner));
        assert.isNumber(order.block);
        assert.isString(order.outcome);
        assert.deepEqual(augur.get_trade(order.id), order);
      }
    }
    t.done();
  };
  for (var i = 0; i < numMarkets; ++i) {
    runtests(this.title, test, markets[i]);
  }
});
