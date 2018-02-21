/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var formatLogMessage = require("../../../../src/format/log/format-log-message");

describe("format/log/format-log-message", function () {
  var test = function (t) {
    it(t.params.contractName + "." + t.params.eventName, function () {
      t.assertions(formatLogMessage(t.params.contractName, t.params.eventName, t.params.message));
    });
  };
  test({
    params: {
      contractName: "LegacyReputationToken",
      eventName: "Approval",
      message: {
        owner: "0x1",
        spender: "0x2",
        value: speedomatic.fix("10", "hex"),
      },
    },
    assertions: function (message) {
      assert.deepEqual(message, {
        owner: "0x1",
        spender: "0x2",
        value: "0x8ac7230489e80000",
      });
    },
  });
});
