/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var assign = require("lodash.assign");
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("reporting/submit-report", function () {
  var test = function (t) {
    it(t.description, function () {
      var submitReport = proxyquire("../../../src/reporting/submit-report", {
        "../api": t.mock.api
      });
      submitReport(assign(t.params, {
        onSent: noop,
        onSuccess: t.assertions,
        onFailed: t.assertions
      }));
    });
  };
  test({
    description: "submit report [0, 1]",
    params: {
      _signer: Buffer.from("PRIVATE_KEY", "utf8"),
      market: "MARKET_CONTRACT_ADDRESS",
      _payoutNumerators: [0, 1],
      _amountToStake: 100
    },
    mock: {
      api: function () {
        return {
          Market: {
            getReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                _payoutNumerators: [0, 1]
              });
              callback("REPORTING_TOKEN_CONTRACT_ADDRESS");
            }
          },
          ReportingToken: {
            buy: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" });
              assert.strictEqual(payload._amountToStake, "0x56bc75e2d63100000");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REPORTING_TOKEN_BUY" });
            }
          }
        };
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "REPORTING_TOKEN_BUY" });
    }
  });
});
