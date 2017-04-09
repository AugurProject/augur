"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../../src/constants");
var tools = require("../../tools");

var augur = tools.setup(require("../../../src"));
var branchID = constants.DEFAULT_BRANCH_ID;
var branchNumber = "0";

describe("getBranches", function () {
  var test = function (r) {
    assert.isArray(r);
    assert.isAbove(r.length, 0);
    assert(abi.bignum(r[0]).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getBranches());
  });
  it("async", function (done) {
    augur.getBranches(function (r) {
      test(r); done();
    });
  });
});
describe("getMarketsInBranch(" + branchID + ")", function () {
  if (parseInt(augur.getNumMarketsBranch(branchID), 10) <= 3000) {
    var test = function (r) {
      assert.isArray(r);
      assert.isAbove(r.length, 1);
    };
    it("sync", function () {
      test(augur.getMarketsInBranch(branchID));
    });
    it("async", function (done) {
      augur.getMarketsInBranch(branchID, function (r) {
        test(r); done();
      });
    });
  }
});
describe("getSomeMarketsInBranch(" + branchID + ", 0, 10)", function () {
  var test = function (r) {
    assert.isArray(r);
    assert.strictEqual(r.length, Math.min(parseInt(augur.getNumMarketsBranch(branchID), 10), 10));
  };
  it("sync", function () {
    test(augur.getSomeMarketsInBranch(branchID, 0, 10));
  });
  it("async", function (done) {
    augur.getSomeMarketsInBranch(branchID, 0, 10, function (r) {
      test(r); done();
    });
  });
});
describe("getPeriodLength(" + branchID + ") == " + constants.DEFAULT_BRANCH_PERIOD_LENGTH, function () {
  var test = function (r) {
    assert.strictEqual(r, constants.DEFAULT_BRANCH_PERIOD_LENGTH);
  };
  it("sync", function () {
    test(augur.getPeriodLength(branchID));
  });
  it("async", function (done) {
    augur.getPeriodLength(branchID, function (r) {
      test(r); done();
    });
  });
});
describe("getVotePeriod(" + branchID + ") >= -1", function () {
  var test = function (r) {
    assert(parseInt(r) >= -1);
  };
  it("sync", function () {
    test(augur.getVotePeriod(branchID));
  });
  it("async", function (done) {
    augur.getVotePeriod(branchID, function (r) {
      test(r); done();
    });
  });
});
describe("getNumMarketsBranch(" + branchID + ") >= 1", function () {
  var test = function (r) {
    assert(parseInt(r) >= 1);
  };
  it("sync", function () {
    test(augur.getNumMarketsBranch(branchID));
  });
  it("async", function (done) {
    augur.getNumMarketsBranch(branchID, function (r) {
      test(r); done();
    });
  });
});
describe("getMinTradingFee(" + branchID + ")", function () {
  var test = function (r) {
    assert(Number(r) >= 0.0);
    assert(Number(r) <= 1.0);
  };
  it("sync", function () {
    test(augur.getMinTradingFee(branchID));
  });
  it("async", function (done) {
    augur.getMinTradingFee(branchID, function (r) {
      test(r); done();
    });
  });
});
describe("getNumBranches()", function () {
  var test = function (r) {
    assert.isAbove(parseInt(r), 0);
  };
  it("sync", function () {
    test(augur.getNumBranches());
  });
  it("async", function (done) {
    augur.getNumBranches(function (r) {
      test(r); done();
    });
  });
});
describe("getBranchByNum(" + branchNumber + ")", function () {
  var test = function (r) {
    assert(abi.bignum(r).eq(abi.bignum(branchID)));
  };
  it("sync", function () {
    test(augur.getBranchByNum(branchNumber));
  });
  it("async", function (done) {
    augur.getBranchByNum(branchNumber, function (r) {
      test(r); done();
    });
  });
});
