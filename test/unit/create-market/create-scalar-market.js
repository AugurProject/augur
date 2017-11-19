/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var immutableDelete = require("immutable-delete");
var proxyquire = require("proxyquire").noPreserveCache();
var DEFAULT_NUM_TICKS = require("../../../src/constants").DEFAULT_NUM_TICKS;

var REPORTING_WINDOW_ADDRESS = "0xeeeeeeeeeeeeeeeee";

describe("create-market/create-scalar-market", function () {
  var extraInfo = {
    marketType: "scalar",
    description: "Will this market be the One Market?",
    longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
    tags: ["Ancient evil", "Large flaming eyes"],
    creationTimestamp: 1234567890,
    minPrice: "-2",
    maxPrice: "15.6",
  };
  var test = function (t) {
    it(t.description, function (done) {
      var createScalarMarket = proxyquire("../../../src/create-market/create-scalar-market", {
        "./create-market": proxyquire("../../../src/create-market/create-market", {
          "./get-market-creation-cost": t.stub.getMarketCreationCost,
          "../api": t.stub.api,
        }),
      });
      createScalarMarket(Object.assign({}, t.params, {
        onSuccess: function (res) {
          t.params.onSuccess(res);
          done();
        },
      }));
    });
  };
  test({
    description: "create a scalar market",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      universe: "UNIVERSE_ADDRESS",
      _endTime: 2345678901,
      minPrice: "-2",
      maxPrice: "15.6",
      _feePerEthInWei: "0x4321",
      _denominationToken: "TOKEN_ADDRESS",
      _designatedReporterAddress: "DESIGNATED_REPORTER_ADDRESS",
      _topic: "TOPIC",
      _extraInfo: immutableDelete(extraInfo, ["minPrice", "maxPrice"]),
      onSent: function (res) {
        assert.deepEqual(res, { callReturn: "1" });
      },
      onSuccess: function (res) {
        assert.deepEqual(res, { callReturn: "1" });
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    stub: {
      getMarketCreationCost: function (p, callback) {
        assert.strictEqual(p.universe, "UNIVERSE_ADDRESS");
        assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
        assert.strictEqual(p.meta.accountType, "privateKey");
        callback(null, { etherRequiredToCreateMarket: "1.1" });
      },
      api: function () {
        return {
          ReportingWindow: {
            createMarket: function (p) {
              assert.deepEqual(p.tx, { to: REPORTING_WINDOW_ADDRESS, value: "0xf43fc2c04ee0000" });
              assert.strictEqual(p._endTime, 2345678901);
              assert.strictEqual(p._numOutcomes, 2);
              assert.strictEqual(p._feePerEthInWei, "0x4321");
              assert.strictEqual(p._denominationToken, "TOKEN_ADDRESS");
              assert.strictEqual(p._designatedReporterAddress, "DESIGNATED_REPORTER_ADDRESS");
              assert.strictEqual(p._topic, "0x544f504943000000000000000000000000000000000000000000000000000000");
              assert.deepEqual(JSON.parse(p._extraInfo), extraInfo);
              assert.strictEqual(p._numTicks, DEFAULT_NUM_TICKS[p._numOutcomes]);
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ callReturn: "1" });
              p.onSuccess({ callReturn: "1" });
            },
          },
          Universe: {
            getReportingWindowByMarketEndTime: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" }, _endTime: 2345678901 });
              callback(null, REPORTING_WINDOW_ADDRESS);
            },
          },
        };
      },
    },
  });
});
