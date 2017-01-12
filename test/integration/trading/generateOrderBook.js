"use strict";

var assert = require("chai").assert;
var madlibs = require("madlibs");
var tools = require("../../tools");
var augur = tools.setup(require("../../../src"), process.argv.slice(2));

describe("generateOrderBook", function () {

  before("top up account", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.fundNewAccount({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      onSent: function (r) {
        assert.strictEqual(r.callReturn, "1");
      },
      onSuccess: function (r) {
        assert.strictEqual(r.callReturn, "1");
        done();
      },
      onFailed: done
    });
  });

  var test = function (t) {
    it("[binary] " + JSON.stringify(t), function (done) {
      this.timeout(tools.TIMEOUT*10);
      var suffix = Math.random().toString(36).substring(4);
      var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
      var expDate = Math.round(new Date().getTime() / 990);
      augur.createSingleEventMarket({
        branchId: augur.constants.DEFAULT_BRANCH_ID,
        description: description,
        expDate: expDate,
        minValue: 1,
        maxValue: 2,
        numOutcomes: 2,
        takerFee: "0.02",
        makerFee: "0.01",
        tags: [madlibs.adjective(), madlibs.noun(), madlibs.verb()],
        extraInfo: madlibs.city() + " " + madlibs.verb() + " " + madlibs.adjective() + " " + madlibs.noun(),
        resolution: madlibs.action() + "." + madlibs.noun() + "." + madlibs.tld(),
        onSent: function (r) {},
        onSuccess: function (r) {
          augur.generateOrderBook({
            market: r.callReturn,
            liquidity: t.liquidity,
            initialFairPrices: ["0.4", "0.5"],
            startingQuantity: t.startingQuantity,
            bestStartingQuantity: t.bestStartingQuantity,
            priceWidth: t.priceWidth,
            onSimulate: function (sim) {},
            onBuyCompleteSets: function (res) {
              assert.isArray(res.callReturn);
            },
            onSetupOutcome: function (res) {
              assert.strictEqual(res.market, r.callReturn);
              assert(res.outcome);
            },
            onSetupOrder: function (res) {
              assert.strictEqual(res.market, r.callReturn);
              assert(res.outcome);
              assert(res.amount);
              assert(res.sellPrice || res.buyPrice);
            },
            onSuccess: function (res) {
                            // console.log("onSuccess", res);
              assert.isObject(res.buy);
              assert.isObject(res.sell);
              done();
            },
            onFailed: done
          });
        },
        onFailed: done
      });
    });
    it("[scalar] " + JSON.stringify(t), function (done) {
      this.timeout(tools.TIMEOUT*10);
      var suffix = Math.random().toString(36).substring(4);
      var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
      var expDate = Math.round(new Date().getTime() / 990);
      augur.createSingleEventMarket({
        branchId: augur.constants.DEFAULT_BRANCH_ID,
        description: description,
        expDate: expDate,
        minValue: 10,
        maxValue: 20,
        numOutcomes: 2,
        takerFee: "0.02",
        makerFee: "0.01",
        tags: [madlibs.adjective(), madlibs.noun(), madlibs.verb()],
        extraInfo: madlibs.city() + " " + madlibs.verb() + " " + madlibs.adjective() + " " + madlibs.noun(),
        resolution: madlibs.action() + "." + madlibs.noun() + "." + madlibs.tld(),
        onSent: function (r) {},
        onSuccess: function (r) {
          var initialFairPrices = [14, 16];
          augur.generateOrderBook({
            market: r.callReturn,
            liquidity: t.liquidity,
            initialFairPrices: initialFairPrices,
            startingQuantity: t.startingQuantity,
            bestStartingQuantity: t.bestStartingQuantity,
            priceWidth: t.priceWidth,
            onSimulate: function (simulation) {},
            onBuyCompleteSets: function (res) {
              assert.isArray(res.callReturn);
            },
            onSetupOutcome: function (res) {
              assert.strictEqual(res.market, r.callReturn);
              assert(res.outcome);
            },
            onSetupOrder: function (res) {
              assert.strictEqual(res.market, r.callReturn);
              assert(res.outcome);
              assert(res.amount);
              assert(res.sellPrice || res.buyPrice);
            },
            onSuccess: function (res) {
              assert.isObject(res.buy);
              assert.isObject(res.sell);
              done();
            },
            onFailed: done
          });
        },
        onFailed: done
      });
    });
    it("[categorical] " + JSON.stringify(t), function (done) {
      this.timeout(tools.TIMEOUT*10);
      var numOutcomes = 5;
      var suffix = Math.random().toString(36).substring(4);
      var description = madlibs.adjective() + "-" + madlibs.noun() + "-" + suffix;
      var choices = new Array(numOutcomes);
      for (var i = 0; i < numOutcomes; ++i) {
        choices[i] = madlibs.action();
      }
      description += "~|>" + choices.join('|');
      var expDate = Math.round(new Date().getTime() / 990);
      augur.createSingleEventMarket({
        branchId: augur.constants.DEFAULT_BRANCH_ID,
        description: description,
        expDate: expDate,
        minValue: 1,
        maxValue: 2,
        numOutcomes: numOutcomes,
        takerFee: "0.02",
        makerFee: "0.01",
        tags: [madlibs.adjective(), madlibs.noun(), madlibs.verb()],
        extraInfo: madlibs.city() + " " + madlibs.verb() + " " + madlibs.adjective() + " " + madlibs.noun(),
        resolution: madlibs.action() + "." + madlibs.noun() + "." + madlibs.tld(),
        onSent: function (r) {},
        onSuccess: function (r) {
          var initialFairPrices = new Array(numOutcomes);
          for (var i = 0; i < numOutcomes; ++i) {
            initialFairPrices[i] = ((0.4*Math.random()) + 0.3).toString();
          }
          augur.generateOrderBook({
            market: r.callReturn,
            liquidity: t.liquidity,
            initialFairPrices: initialFairPrices,
            startingQuantity: t.startingQuantity,
            bestStartingQuantity: t.bestStartingQuantity,
            priceWidth: t.priceWidth,
            onSimulate: function (simulation) {},
            onBuyCompleteSets: function (res) {
              assert.isArray(res.callReturn);
            },
            onSetupOutcome: function (res) {
              assert.strictEqual(res.market, r.callReturn);
              assert(res.outcome);
            },
            onSetupOrder: function (res) {
              assert.strictEqual(res.market, r.callReturn);
              assert(res.outcome);
              assert(res.amount);
              assert(res.sellPrice || res.buyPrice);
            },
            onSuccess: function (res) {
              assert.isObject(res.buy);
              assert.isObject(res.sell);
              done();
            },
            onFailed: done
          });
        },
        onFailed: done
      });
    });
  };
  test({
    liquidity: 500,
    startingQuantity: 50,
    bestStartingQuantity: 100,
    priceWidth: "0.4"
  });
});
