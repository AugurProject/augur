/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var tools = require("../../tools");
require('it-each')({ testPerIteration: true });

describe("CreateMarket.createEvent", function () {
  var minValue = 1;
  var maxValue = 2;
  var numOutcomes = 2;
  var numEvents = 2;
  var augur = tools.setup(require("../../../src"), process.argv.slice(2));
  var branch = augur.constants.DEFAULT_BRANCH_ID;
  var period = augur.getVotePeriod(branch);
  var expDate = parseInt(new Date().getTime() / 995);
  var resolution = "https://www.google.com";
  describe("Creating " + numEvents + " events", function () {
    var events = [];
    it.each(new Array(numEvents), "create event %s", ['element'], function (element, next) {
      this.timeout(tools.TIMEOUT);
      var description = "€" + Math.random().toString(36).substring(4);
      augur.createEvent({
        branchId: branch,
        description: description,
        expDate: expDate,
        minValue: minValue,
        maxValue: maxValue,
        numOutcomes: numOutcomes,
        resolution: resolution,
        onSent: function (r) {
          assert(r.txHash);
          assert(r.callReturn);
        },
        onSuccess: function (r) {
          var eventID = r.callReturn;
          assert.strictEqual(augur.Events.getResolution(eventID), resolution);
          assert.strictEqual(augur.getCreator(eventID), augur.coinbase);
          assert.strictEqual(augur.getDescription(eventID), description);
          next();
        },
        onFailed: function (r) {
          next(new Error(tools.pp(r)));
        }
      });
    });
  });
});
