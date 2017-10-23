/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

var shareTokenAddresses = [
  "SHARE_TOKEN_ADDRESS_0",
  "SHARE_TOKEN_ADDRESS_1",
  "SHARE_TOKEN_ADDRESS_2",
  "SHARE_TOKEN_ADDRESS_3",
  "SHARE_TOKEN_ADDRESS_4",
  "SHARE_TOKEN_ADDRESS_5",
  "SHARE_TOKEN_ADDRESS_6"
];

var shareTokenBalances = {
  "SHARE_TOKEN_ADDRESS_0": "0x2a00",
  "SHARE_TOKEN_ADDRESS_1": "0x1500",
  "SHARE_TOKEN_ADDRESS_2": "0x2a00",
  "SHARE_TOKEN_ADDRESS_3": "0x0",
  "SHARE_TOKEN_ADDRESS_4": "0x0",
  "SHARE_TOKEN_ADDRESS_5": "0x2a00",
  "SHARE_TOKEN_ADDRESS_6": "0x3f00"
};

describe("trading/get-position-in-market", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getPositionInMarket = proxyquire("../../../src/trading/get-position-in-market", {
        "../api": t.stub.api
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
      market: "MARKET_ADDRESS"
    },
    stub: {
      api: function () {
        return {
          Market: {
            getNumberOfOutcomes: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "MARKET_ADDRESS" } });
              callback(null, "0x7");
            },
            getNumTicks: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "MARKET_ADDRESS" } });
              callback(null, "0x2a00");
            },
            getShareToken: function (p, callback) {
              assert.oneOf(p._outcome, [0, 1, 2, 3, 4, 5, 6]);
              assert.deepEqual(p.tx, { to: "MARKET_ADDRESS" });
              callback(null, shareTokenAddresses[p._outcome]);
            }
          },
          ShareToken: {
            balanceOf: function (p, callback) {
              assert.strictEqual(p.address, "USER_ADDRESS");
              assert.oneOf(p.tx.to, shareTokenAddresses);
              callback(null, shareTokenBalances[p.tx.to]);
            }
          }
        };
      }
    },
    assertions: function (err, positionInMarket) {
      assert.isNull(err);
      assert.deepEqual(positionInMarket, ["1", "0.5", "1", "0", "0", "1", "1.5"]);
    }
  });
});
