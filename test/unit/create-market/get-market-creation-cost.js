/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

var counter = 0;

describe("create-market/get-market-creation-cost", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketCreationCost = proxyquire("../../../src/create-market/get-market-creation-cost", {
        "../api": t.stub.api,
        "./create-current-reporting-window": proxyquire("../../../src/create-market/create-current-reporting-window", {
          "../api": t.stub.api,
        }),
      });
      getMarketCreationCost(t.params, function (err, marketCreationCost) {
        t.assertions(err, marketCreationCost);
        done();
      });
    });
  };
  test({
    description: "current reporting window exists",
    params: {
      universe: "UNIVERSE_ADDRESS",
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getDesignatedReportNoShowBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              callback(null, "0xde0b6b3a7640000");
            },
            getMarketCreationCost: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              callback(null, "0x3a4965bf58a40000");
            },
            getOrCacheMarketCreationCost: function (/*p*/) {
              assert.fail();
            },
          },
        };
      }
    },
    assertions: function (err, marketCreationCost) {
      assert.isNull(err);
      assert.deepEqual(marketCreationCost, {
        designatedReportNoShowReputationBond: "1",
        etherRequiredToCreateMarket: "4.2",
      });
    }
  });
  test({
    description: "current reporting window does not exist",
    params: {
      universe: "UNIVERSE_ADDRESS",
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getDesignatedReportNoShowBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              if (counter === 0) {
                counter++;
                callback(null, "0x0");
              } else {
                callback(null, "0xde0b6b3a7640000");
              }
            },
            getMarketCreationCost: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              callback(null, "0x3a4965bf58a40000");
            },
            getOrCacheMarketCreationCost: function (p) {
              assert.deepEqual(p.tx, { to: "UNIVERSE_ADDRESS" });
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSuccess({ callReturn: "0x3a4965bf58a40000" });
            },
          },
        };
      }
    },
    assertions: function (err, marketCreationCost) {
      assert.isNull(err);
      assert.strictEqual(counter, 1);
      assert.deepEqual(marketCreationCost, {
        designatedReportNoShowReputationBond: "1",
        etherRequiredToCreateMarket: "4.2",
      });
    }
  });
});
