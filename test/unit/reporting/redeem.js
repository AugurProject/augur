"use strict";

var assert = require("chai").assert;
var assign = require("lodash.assign");
var proxyquire = require("proxyquire");
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
      marketID: "MARKET_CONTRACT_ADDRESS",
      payoutNumerators: [0, 1],
      reporter: "REPORTER_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getForkingMarket: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "BRANCH_CONTRACT_ADDRESS" } });
              callback("FORKING_MARKET_CONTRACT_ADDRESS");
            }
          },
          Market: {
            getReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                payoutNumerators: [0, 1]
              });
              callback("REPORTING_TOKEN_CONTRACT_ADDRESS");
            },
            isContainerForReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                reportingToken: "REPORTING_TOKEN_CONTRACT_ADDRESS"
              });
              callback("0x1");
            },
            getFinalWinningReportingToken: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "MARKET_CONTRACT_ADDRESS" } });
              callback("REPORTING_TOKEN_CONTRACT_ADDRESS");
            }
          },
          ReportingToken: {
            balanceOf: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" },
                address: "REPORTER_ADDRESS"
              });
              callback("0x10");
            },
            getBranch: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" } });
              callback("BRANCH_CONTRACT_ADDRESS");
            },
            redeemDisavowedTokens: function (payload) {
              assert.fail();
            },
            redeemForkedTokens: function (payload) {
              assert.fail();
            },
            redeemWinningTokens: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REPORTING_TOKEN_CONTRACT_ADDRESS", send: true });
              assert.strictEqual(payload.reporter, "REPORTER_ADDRESS");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REDEEM_WINNING_TOKENS" });
            }
          }
        }
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
      marketID: "MARKET_CONTRACT_ADDRESS",
      payoutNumerators: [0, 1],
      reporter: "REPORTER_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getForkingMarket: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "BRANCH_CONTRACT_ADDRESS" } });
              callback("MARKET_CONTRACT_ADDRESS");
            }
          },
          Market: {
            getReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                payoutNumerators: [0, 1]
              });
              callback("REPORTING_TOKEN_CONTRACT_ADDRESS");
            },
            isContainerForReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                reportingToken: "REPORTING_TOKEN_CONTRACT_ADDRESS"
              });
              callback("0x1");
            },
            getFinalWinningReportingToken: function (payload, callback) {
              assert.fail();
            }
          },
          ReportingToken: {
            balanceOf: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" },
                address: "REPORTER_ADDRESS"
              });
              callback("0x10");
            },
            getBranch: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" } });
              callback("BRANCH_CONTRACT_ADDRESS");
            },
            redeemDisavowedTokens: function (payload) {
              assert.fail();
            },
            redeemForkedTokens: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REPORTING_TOKEN_CONTRACT_ADDRESS", send: true });
              assert.strictEqual(payload.reporter, "REPORTER_ADDRESS");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REDEEM_FORKED_TOKENS" });
            },
            redeemWinningTokens: function (payload) {
              assert.fail();
            }
          }
        }
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
      marketID: "MARKET_CONTRACT_ADDRESS",
      payoutNumerators: [0, 1],
      reporter: "REPORTER_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getForkingMarket: function (payload, callback) {
              assert.fail();
            }
          },
          Market: {
            getReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                payoutNumerators: [0, 1]
              });
              callback("REPORTING_TOKEN_CONTRACT_ADDRESS");
            },
            isContainerForReportingToken: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "MARKET_CONTRACT_ADDRESS" },
                reportingToken: "REPORTING_TOKEN_CONTRACT_ADDRESS"
              });
              callback("0x0");
            },
            getFinalWinningReportingToken: function (payload, callback) {
              assert.fail();
            }
          },
          ReportingToken: {
            balanceOf: function (payload, callback) {
              assert.deepEqual(payload, {
                tx: { to: "REPORTING_TOKEN_CONTRACT_ADDRESS" },
                address: "REPORTER_ADDRESS"
              });
              callback("0x10");
            },
            getBranch: function (payload, callback) {
              assert.fail();
            },
            redeemDisavowedTokens: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REPORTING_TOKEN_CONTRACT_ADDRESS", send: true });
              assert.strictEqual(payload.reporter, "REPORTER_ADDRESS");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REDEEM_DISAVOWED_TOKENS" });
            },
            redeemForkedTokens: function (payload) {
              assert.fail();
            },
            redeemWinningTokens: function (payload) {
              assert.fail();
            }
          }
        }
      },
      finalizeMarket: function (p) {
        assert.fail();
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "REDEEM_DISAVOWED_TOKENS" });
    }
  });
});
