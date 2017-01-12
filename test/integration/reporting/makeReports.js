/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../../src/utilities");
var makeReports = require("../../../src/modules/makeReports");
var augur = require("../../tools").setup(require("../../../src"), process.argv.slice(2));

before(function () {
  makeReports.options = {debug: {reporting: false}};
});
after(function () {
  delete makeReports.options;
});

describe("makeHash", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var localHash = makeReports.makeHash(t.salt, t.report, t.event, t.from, t.isScalar, t.isIndeterminate);
      assert.strictEqual(localHash, augur.MakeReports.makeHash(abi.hex(t.salt), abi.hex(t.report), t.event, t.from));
    });
  };
  var salt, report, from, event, isScalar, isIndeterminate;
  for (var i = 0; i < 10; ++i) {
    salt = abi.prefix_hex(utils.sha256(Math.random().toString()));
    report = Math.round(Math.random() * 50);
    event = abi.prefix_hex(utils.sha256(Math.random().toString()));
    test({
      salt: salt,
      report: report,
      from: augur.from,
      event: event,
      isScalar: false,
      isIndeterminate: false
    });
    test({
      salt: salt,
      report: report,
      from: augur.from,
      event: event,
      isScalar: true,
      isIndeterminate: false
    });
    test({
      salt: salt,
      report: report,
      from: augur.from,
      event: event,
      isScalar: false,
      isIndeterminate: true
    });
    test({
      salt: salt,
      report: report,
      from: augur.from,
      event: event,
      isScalar: false,
      isIndeterminate: false
    });
  }
});
