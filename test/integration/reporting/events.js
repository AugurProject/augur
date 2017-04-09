"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");

var augur = tools.setup(require("../../../src"));
var amount = "1";
var branchID = augur.constants.DEFAULT_BRANCH_ID;
var numMarkets = parseInt(augur.getNumMarketsBranch(branchID), 10);
var markets = augur.getSomeMarketsInBranch(branchID, numMarkets - 100, numMarkets);
var marketID = markets[markets.length - 1];
var eventID = augur.getMarketEvent(marketID, 0);

describe("getMarkets(" + eventID + ")", function () {
  var test = function (res) {
    assert.isArray(res);
    assert.isAbove(res.length, 0);
    assert.include(res, marketID);
  };
  it("sync", function () {
    test(augur.getMarkets(eventID));
  });
  it("async", function (done) {
    augur.getMarkets(eventID, function (r) {
      test(r); done();
    });
  });
});
describe("getEventInfo(" + eventID + ")", function () {
  var test = function (res) {
    assert.strictEqual(res.length, 7);
    assert(abi.bignum(res[0]).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getEventInfo(eventID));
  });
  it("async", function (done) {
    augur.getEventInfo(eventID, function (r) {
      test(r); done();
    });
  });
});

describe("getEventBranch(" + eventID + ")", function () {
  var test = function (r) {
    assert(abi.bignum(r).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getEventBranch(eventID));
  });
  it("async", function (done) {
    augur.getEventBranch(eventID, function (r) {
      test(r); done();
    });
  });
});
describe("getExpiration(" + eventID + ")", function () {
  var test = function (r) {
    assert(parseInt(r) >= 10);
  };
  it("sync", function () {
    test(augur.getExpiration(eventID));
  });
  it("async", function (done) {
    augur.getExpiration(eventID, function (r) {
      test(r); done();
    });
  });
});
describe("getOutcome(" + eventID + ")", function () {
  var test = function (r) {
    assert.strictEqual(r, "0");
  };
  it("sync", function () {
    test(augur.getOutcome(eventID));
  });
  it("async", function (done) {
    augur.getOutcome(eventID, function (r) {
      test(r); done();
    });
  });
});
describe("getMinValue(" + eventID + ")", function () {
  var test = function (r) {
    assert.isNumber(abi.number(r));
  };
  it("sync", function () {
    test(augur.getMinValue(eventID));
  });
  it("async", function (done) {
    augur.getMinValue(eventID, function (r) {
      test(r); done();
    });
  });
});
describe("getMaxValue(" + eventID + ")", function () {
  var test = function (r) {
    assert.isAbove(abi.number(r), 0);
  };
  it("sync", function () {
    test(augur.getMaxValue(eventID));
  });
  it("async", function (done) {
    augur.getMaxValue(eventID, function (r) {
      test(r); done();
    });
  });
});
describe("getNumOutcomes(" + eventID + ")", function () {
  var test = function (r) {
    assert.isAbove(abi.number(r), 1);
  };
  it("sync", function () {
    test(augur.getNumOutcomes(eventID));
  });
  it("async", function (done) {
    augur.getNumOutcomes(eventID, function (r) {
      test(r); done();
    });
  });
});
