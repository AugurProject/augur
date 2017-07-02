"use strict";

var assert = require("chai").assert;
var assign = require("lodash.assign");
var proxyquire = require("proxyquire");
var noop = require("../../../src/utils/noop");

describe("reporting/register-to-report", function () {
  var test = function (t) {
    it(t.description, function () {
      var registerToReport = proxyquire("../../../src/reporting/register-to-report", {
        "../api": t.mock.api
      });
      registerToReport(assign(t.params, {
        onSent: noop,
        onSuccess: t.assertions,
        onFailed: t.assertions
      }));
    });
  };
  test({
    description: "register to report, include signer buffer",
    params: {
      _signer: Buffer.from("PRIVATE_KEY", "utf8"),
      branchID: "BRANCH_CONTRACT_ADDRESS"
    },
    mock: {
      api: function () {
        return {
          Branch: {
            getNextReportingWindow: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "BRANCH_CONTRACT_ADDRESS" } });
              callback("REPORTING_WINDOW_CONTRACT_ADDRESS");
            }
          },
          ReportingWindow: {
            getRegistrationToken: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "REPORTING_WINDOW_CONTRACT_ADDRESS" } });
              callback("REGISTRATION_TOKEN_CONTRACT_ADDRESS");
            }
          },
          RegistrationToken: {
            register: function (payload) {
              assert.strictEqual(payload._signer.toString("utf8"), "PRIVATE_KEY");
              assert.deepEqual(payload.tx, { to: "REGISTRATION_TOKEN_CONTRACT_ADDRESS", send: true });
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "REGISTER_CALLRETURN" });
            }
          }
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "REGISTER_CALLRETURN" });
    }
  });
});
