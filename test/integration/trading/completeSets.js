/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var abi = require("augur-abi");
var assert = require("chai").assert;
var tools = require("../../tools");

describe("CompleteSets", function () {

  var augur = tools.setup(require("../../../src"), process.argv.slice(2));
  var branchID = augur.constants.DEFAULT_BRANCH_ID;
  var numMarkets = parseInt(augur.getNumMarketsBranch(branchID), 10);
  var markets = augur.getSomeMarketsInBranch(branchID, numMarkets - 100, numMarkets);

  describe("CompleteSets.buyCompleteSets", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT);
        augur.buyCompleteSets({
          market: t.market,
          amount: t.amount,
          onSent: function (r) {
            assert.isNull(r.callReturn);
          },
          onSuccess: function (r) {
            assert.strictEqual(abi.unfix(r.callReturn[0], "string"), t.amount.toString());
            done();
          },
          onFailed: done
        });
      });
    };
    test({
      market: markets[markets.length - 1],
      amount: 1
    });
    test({
      market: markets[markets.length - 1],
      amount: "1.2"
    });
    test({
      market: markets[markets.length - 1],
      amount: "0.1"
    });
    test({
      market: markets[markets.length - 2],
      amount: "0.01"
    });
  });

  describe("CompleteSets.sellCompleteSets", function () {
    var test = function (t) {
      it(JSON.stringify(t), function (done) {
        this.timeout(tools.TIMEOUT);
        augur.sellCompleteSets({
          market: t.market,
          amount: t.amount,
          onSent: function (r) {
            assert.isNull(r.callReturn);
          },
          onSuccess: function (r) {
            assert.strictEqual(abi.unfix(r.callReturn[0], "string"), t.amount.toString());
            done();
          },
          onFailed: done
        });
      });
    };
    test({
      market: markets[markets.length - 1],
      amount: 1
    });
    test({
      market: markets[markets.length - 1],
      amount: "1.2"
    });
    test({
      market: markets[markets.length - 1],
      amount: "0.1"
    });
    test({
      market: markets[markets.length - 2],
      amount: "0.01"
    });
  });
});
