#!/usr/bin/env node

"use strict";

var tools = require("../test/tools");
var augur = tools.setup(require("../src"), process.argv.slice(2));

augur.createSingleEventMarket({
  branchId: augur.constants.DEFAULT_BRANCH_ID,
  description: "This is a test market",
  expDate: new Date().getTime() / 500,
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  tradingFee: "0.03",
  makerFees: "0.5",
  tags: ["tests", "augur.js", "eyesores"],
  extraInfo: "Test markets are really terrific!  I wish there were more of them on this site!",
  resolution: "augur.js",
  onSent: function (r) {
    console.log("createSingleEventMarket sent:", r);
  },
  onSuccess: function (r) {
    console.log("createSingleEventMarket success:", r);
    var market = r.marketID;
    // market = "0x91a47d89cf4b27a2d1da853ff36a88fc7a13a88cd02b766bfdef6c0e8681348c";
    var p = {
      market: market,
      liquidity: 100,
      initialFairPrice: "0.4",
      startingQuantity: 5,
      bestStartingQuantity: 10,
      priceWidth: "0.4",
      priceDepth: "0.2",
      // isSimulation: true
    };
    // augur.generateOrderBook(p, {onSimulate: console.log});
    augur.generateOrderBook(p, {
      onBuyCompleteSets: function (res) {
        console.log("onBuyCompleteSets", res);
      },
      onSetupOutcome: function (res) {
        console.log("onSetupOutcome", res);
      },
      onSetupOrder: function (res) {
        console.log("onSetupOrder", res);
      },
      onSuccess: function (res) {
        console.log("onSuccess", res);
      },
      onFailed: console.error
    });
  },
  onFailed: function (err) {
    console.error("createSingleEventMarket failed:", err);
  }
});
