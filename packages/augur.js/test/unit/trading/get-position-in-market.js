/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var proxyquire = require("proxyquire").noPreserveCache();
var constants = require("../../../src/constants");

describe("trading/get-position-in-market", function () {
  var tickSize = new BigNumber(1, 10).dividedBy(constants.DEFAULT_NUM_TICKS["7"]);
  var shareTokenAddresses = [
    "SHARE_TOKEN_ADDRESS_0",
    "SHARE_TOKEN_ADDRESS_1",
    "SHARE_TOKEN_ADDRESS_2",
    "SHARE_TOKEN_ADDRESS_3",
    "SHARE_TOKEN_ADDRESS_4",
    "SHARE_TOKEN_ADDRESS_5",
    "SHARE_TOKEN_ADDRESS_6",
  ];
  var shareTokenBalances = {
    "SHARE_TOKEN_ADDRESS_0": speedomatic.fix(tickSize, "string"),
    "SHARE_TOKEN_ADDRESS_1": speedomatic.fix(tickSize).dividedBy("2").toFixed(),
    "SHARE_TOKEN_ADDRESS_2": speedomatic.fix(tickSize, "string"),
    "SHARE_TOKEN_ADDRESS_3": "0",
    "SHARE_TOKEN_ADDRESS_4": "0",
    "SHARE_TOKEN_ADDRESS_5": speedomatic.fix(tickSize, "string"),
    "SHARE_TOKEN_ADDRESS_6": speedomatic.fix(tickSize).times("1.5").toFixed(),
  };
  var test = function (t) {
    it(t.description, function (done) {
      var getPositionInMarket = proxyquire("../../../src/trading/get-position-in-market", {
        "../api": t.stub.api,
      });
      getPositionInMarket(t.params, function (err, positionInMarket) {
        t.assertions(err, positionInMarket);
        done();
      });
    });
  };
  test({
    description: "get position in market",
    params: {
      address: "USER_ADDRESS",
      market: "MARKET_ADDRESS",
      tickSize: tickSize,
    },
    stub: {
      api: function () {
        return {
          Market: {
            getNumberOfOutcomes: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "MARKET_ADDRESS" } });
              callback(null, "7");
            },
            getShareToken: function (p, callback) {
              assert.oneOf(p._outcome, [0, 1, 2, 3, 4, 5, 6]);
              assert.deepEqual(p.tx, { to: "MARKET_ADDRESS" });
              callback(null, shareTokenAddresses[p._outcome]);
            },
          },
          ShareToken: {
            balanceOf: function (p, callback) {
              assert.strictEqual(p._owner, "USER_ADDRESS");
              assert.oneOf(p.tx.to, shareTokenAddresses);
              callback(null, shareTokenBalances[p.tx.to]);
            },
          },
        };
      },
    },
    assertions: function (err, positionInMarket) {
      assert.isNull(err);
      assert.deepEqual(positionInMarket, ["1", "0.5", "1", "0", "0", "1", "1.5"]);
    },
  });
});
