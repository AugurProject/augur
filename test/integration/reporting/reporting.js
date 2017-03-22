/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");
var augur = tools.setup(require("../../../src"), process.argv.slice(2));
var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
var branchID = augur.constants.DEFAULT_BRANCH_ID;
var reporterIndex = "1";

describe("getTotalRep(" + branchID + ")", function () {
  var test = function (r) {
    assert(parseInt(r) >= 44);
  };
  it("sync", function () {
    test(augur.getTotalRep(branchID));
  });
  it("async", function (done) {
    augur.getTotalRep(branchID, function (r) {
      test(r); done();
    });
  });
});

describe("getRepBalance(" + branchID + ") ", function () {
  var test = function (r) {
    tools.gteq0(r);
  };
  it("sync", function () {
    test(augur.getRepBalance(branchID, accounts[0]));
  });
  it("async", function (done) {
    augur.getRepBalance(branchID, accounts[0], function (r) {
      test(r); done();
    });
  });
});

describe("getRepByIndex(" + branchID + ", " + reporterIndex + ") ", function () {
  var test = function (r) {
    assert(Number(r) >= 0);
  };
  it("sync", function () {
    test(augur.getRepByIndex(branchID, reporterIndex));
  });
  it("async", function (done) {
    augur.getRepByIndex(branchID, reporterIndex, function (r) {
      test(r); done();
    });
  });
});

describe("getReporterID(" + branchID + ", " + reporterIndex + ") ", function () {
  var test = function (r) {
    assert.strictEqual(abi.hex(r), abi.hex(branchID));
  };
  it("sync", function () {
    test(augur.getReporterID(branchID, reporterIndex));
  });
  it("async", function (done) {
    augur.getReporterID(branchID, reporterIndex, function (r) {
      test(r); done();
    });
  });
});

describe("getNumberReporters(" + branchID + ") ", function () {
  var test = function (r) {
    assert(parseInt(r) >= 1);
  };
  it("sync", function () {
    test(augur.getNumberReporters(branchID));
  });
  it("async", function (done) {
    augur.getNumberReporters(branchID, function (r) {
      test(r); done();
    });
  });
});

describe("repIDToIndex(" + branchID + ", " + accounts[0] + ") ", function () {
  var test = function (r) {
    assert(parseInt(r) >= 0);
  };
  it("sync", function () {
    test(augur.repIDToIndex(branchID, accounts[0]));
  });
  it("async", function (done) {
    augur.repIDToIndex(branchID, accounts[0], function (r) {
      test(r); done();
    });
  });
});
