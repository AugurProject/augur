/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var assign = require("lodash.assign");
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("reporting/migrate-losing-tokens", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var migrateLosingTokens = proxyquire("../../../src/reporting/migrate-losing-tokens", {
        "../api": t.mock.api,
        "../events/get-logs": t.mock.getLogs
      });
      migrateLosingTokens(assign(t.params, {
        onSent: noop,
        onSuccess: function (output) {
          t.assertions(output);
          done();
        },
        onFailed: function (err) {
          t.assertions(err);
          done();
        }
      }));
    });
  };
  test({
    description: "migrate losing tokens",
    params: {
      _signer: Buffer.from("PRIVATE_KEY", "utf8"),
      branchID: "BRANCH_CONTRACT_ADDRESS",
      market: "MARKET_CONTRACT_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getPreviousReportingWindow: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "BRANCH_CONTRACT_ADDRESS" } });
              callback(null, "PREVIOUS_REPORTING_WINDOW_CONTRACT_ADDRESS");
            },
            getReputationToken: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "BRANCH_CONTRACT_ADDRESS" } });
              callback(null, "REPUTATION_TOKEN_CONTRACT_ADDRESS");
            }
          },
          ReportingToken: {
            migrateLosingTokens: function (payload) {
              assert.strictEqual(payload.tx.to, "REPORTING_TOKEN_CONTRACT_ADDRESS");
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "MIGRATE_LOSING_TOKENS_CALLRETURN" });
            }
          },
          ReportingWindow: {
            getStartBlock: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "PREVIOUS_REPORTING_WINDOW_CONTRACT_ADDRESS" } });
              callback(null, "PREVIOUS_REPORTING_WINDOW_START_BLOCK");
            },
            getEndBlock: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "PREVIOUS_REPORTING_WINDOW_CONTRACT_ADDRESS" } });
              callback(null, "PREVIOUS_REPORTING_WINDOW_END_BLOCK");
            }
          }
        };
      },
      getLogs: function (p, callback) {
        assert.deepEqual(p, {
          label: "Transfer",
          filter: {
            fromBlock: "PREVIOUS_REPORTING_WINDOW_START_BLOCK",
            toBlock: "PREVIOUS_REPORTING_WINDOW_END_BLOCK",
            market: "MARKET_CONTRACT_ADDRESS",
            address: "REPUTATION_TOKEN_CONTRACT_ADDRESS"
          }
        });
        callback(null, [{ to: "REPORTING_TOKEN_CONTRACT_ADDRESS" }]);
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "MIGRATE_LOSING_TOKENS_CALLRETURN" });
    }
  });
});
