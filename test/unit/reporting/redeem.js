/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var assign = require("lodash.assign");
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("reporting/redeem", function () {
  var test = function (t) {
    it(t.description, function () {
      var redeem = proxyquire("../../../src/reporting/redeem", {
        "./finalize-market": t.mock.finalizeMarket,
        "../api": t.mock.api
      });
      redeem(assign(t.params, {
        onSent: noop,
        onSuccess: t.assertions,
        onFailed: t.assertions
      }));
    });
  };
  test({
    description: "redeem winning reporting token",
    params: {
      _signer: Buffer.from("PRIVATE_KEY", "utf8"),
      market: "MARKET_CONTRACT_ADDRESS",
      _payoutNumerators: [0, 1],
      _reporter: "REPORTER_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getForkingMarket: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "BRANCH_CONTRACT_ADDRESS" } });
              callback(null, "FORKING_MARKET_CONTRACT_ADDRESS");
            }
          },
          Market: {
            getReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                _payoutNumerators: [0, 1]
              });
              callback(null, "REPORTING_TOKEN_CONTRACT_ADDRESS");
            },
            isContainerForReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                reportingToken: "REPORTING_TOKEN_CONTRACT_ADDRESS"
              });
              callback(null, "0x1");
            },
            getFinalWinningReportingToken: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "MARKET_CONTRACT_ADDRESS" } });
              callback(null, "REPORTING_TOKEN_CONTRACT_ADDRESS");
            }
          },
          ReportingToken: {
            balanceOf: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" },
                address: "REPORTER_ADDRESS"
              });
              callback(null, "0x10");
            },
            getBranch: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" } });
              callback(null, "BRANCH_CONTRACT_ADDRESS");
            },
            redeemDisavowedTokens: function () {
              assert.fail();
            },
            redeemForkedTokens: function () {
              assert.fail();
            },
            redeemWinningTokens: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" });
              assert.strictEqual(payload._reporter, "REPORTER_ADDRESS");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REDEEM_WINNING_TOKENS" });
            }
          }
        };
      },
      finalizeMarket: function (p) {
        p.onSuccess(true);
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "REDEEM_WINNING_TOKENS" });
    }
  });
  test({
    description: "redeem reporting token for forked market",
    params: {
      _signer: Buffer.from("PRIVATE_KEY", "utf8"),
      market: "MARKET_CONTRACT_ADDRESS",
      _payoutNumerators: [0, 1],
      _reporter: "REPORTER_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getForkingMarket: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "BRANCH_CONTRACT_ADDRESS" } });
              callback(null, "MARKET_CONTRACT_ADDRESS");
            }
          },
          Market: {
            getReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                _payoutNumerators: [0, 1]
              });
              callback(null, "REPORTING_TOKEN_CONTRACT_ADDRESS");
            },
            isContainerForReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                reportingToken: "REPORTING_TOKEN_CONTRACT_ADDRESS"
              });
              callback(null, "0x1");
            },
            getFinalWinningReportingToken: function () {
              assert.fail();
            }
          },
          ReportingToken: {
            balanceOf: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" },
                address: "REPORTER_ADDRESS"
              });
              callback(null, "0x10");
            },
            getBranch: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" } });
              callback(null, "BRANCH_CONTRACT_ADDRESS");
            },
            redeemDisavowedTokens: function () {
              assert.fail();
            },
            redeemForkedTokens: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" });
              assert.strictEqual(payload._reporter, "REPORTER_ADDRESS");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REDEEM_FORKED_TOKENS" });
            },
            redeemWinningTokens: function () {
              assert.fail();
            }
          }
        };
      },
      finalizeMarket: function (p) {
        p.onSuccess(true);
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "REDEEM_FORKED_TOKENS" });
    }
  });
  test({
    description: "redeem reporting token for disavowed market",
    params: {
      _signer: Buffer.from("PRIVATE_KEY", "utf8"),
      market: "MARKET_CONTRACT_ADDRESS",
      _payoutNumerators: [0, 1],
      _reporter: "REPORTER_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getForkingMarket: function () {
              assert.fail();
            }
          },
          Market: {
            getReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                _payoutNumerators: [0, 1]
              });
              callback(null, "REPORTING_TOKEN_CONTRACT_ADDRESS");
            },
            isContainerForReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                reportingToken: "REPORTING_TOKEN_CONTRACT_ADDRESS"
              });
              callback(null, "0x0");
            },
            getFinalWinningReportingToken: function () {
              assert.fail();
            }
          },
          ReportingToken: {
            balanceOf: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" },
                address: "REPORTER_ADDRESS"
              });
              callback(null, "0x10");
            },
            getBranch: function () {
              assert.fail();
            },
            redeemDisavowedTokens: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" });
              assert.strictEqual(payload._reporter, "REPORTER_ADDRESS");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REDEEM_DISAVOWED_TOKENS" });
            },
            redeemForkedTokens: function () {
              assert.fail();
            },
            redeemWinningTokens: function () {
              assert.fail();
            }
          }
        };
      },
      finalizeMarket: function () {
        assert.fail();
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "REDEEM_DISAVOWED_TOKENS" });
    }
  });
});
