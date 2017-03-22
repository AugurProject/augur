/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");

var augur = tools.setup(require("../../../src"), process.argv.slice(2));
var constants = augur.constants;
var branchID = augur.constants.DEFAULT_BRANCH_ID;
var accounts = tools.get_test_accounts(augur, tools.MAX_TEST_ACCOUNTS);
var testAccount = accounts[0];
var numMarkets = parseInt(augur.getNumMarketsBranch(branchID), 10);
var markets;
if (numMarkets > 100) {
  markets = augur.getSomeMarketsInBranch(branchID, numMarkets - 100, numMarkets);
} else {
  markets = augur.getMarketsInBranch(branchID);
}
var marketID = markets[0];
var market_creator_1 = testAccount;
var marketID2 = markets[1];
var market_creator_2 = testAccount;
var eventID = augur.getMarketEvent(marketID, 0);

function check_account(account) {
  assert.isAbove(abi.bignum(account).toNumber(), 0);
  if (augur.rpc.version() === "10101") {
    assert.include(accounts, account);
  }
}

describe("info.se", function () {
  describe("getCreator(" + eventID + ") [event]", function () {
    var test = function (r) {
      check_account(r);
    };
    it("sync", function () {
      test(augur.getCreator(eventID));
    });
    it("async", function (done) {
      augur.getCreator(eventID, function (r) {
        test(r); done();
      });
    });
  });
  describe("getCreator(" + marketID + ") [market]", function () {
    var test = function (r) {
      check_account(r);
    };
    it("sync", function () {
      test(augur.getCreator(marketID));
    });
    it("async", function (done) {
      augur.getCreator(marketID, function (r) {
        test(r); done();
      });
    });
  });
  describe("getCreationFee(" + marketID + ") [event]", function () {
    var test = function (r) {
      assert(Number(r) > 0);
    };
    it("sync", function () {
      test(augur.getCreationFee(marketID));
    });
    it("async", function (done) {
      augur.getCreationFee(marketID, function (r) {
        test(r); done();
      });
    });
  });
  describe("getCreationFee(" + marketID + ") [market]", function () {
    var test = function (r) {
      assert(Number(r) > 0);
    };
    it("sync", function () {
      test(augur.getCreationFee(marketID));
    });
    it("async", function (done) {
      augur.getCreationFee(marketID, function (r) {
        test(r); done();
      });
    });
  });
  describe("getDescription(" + eventID + ")", function () {
    var test = function (r) {
      assert.isAbove(r.length, 0);
    };
    it("sync", function () {
      test(augur.getDescription(eventID));
    });
    it("async", function (done) {
      augur.getDescription(eventID, function (r) {
        test(r); done();
      });
    });
  });
});
