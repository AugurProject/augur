/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var subscriptions = require("../../../src/filters/subscriptions");
var addFilter = require("../../../src/filters/add-filter");

describe("filters/add-filter", function () {
  var test = function (t) {
    it(t.description, function (done) {
      addFilter(t.params.blockStream, t.params.contractName, t.params.eventName, t.params.eventAbi, t.params.contracts, t.params.addSubscription, function (message) {
        t.assertions(message, subscriptions.getSubscriptions());
        done();
      });
    });
  };
  test({
    description: "Subscribe to new blocks",
    params: {
      blockStream: {
        subscribeToOnBlockAdded: function (callback) {
          callback({ number: "0x42" });
        }
      },
      contractName: "block",
      eventAbi: undefined,
      contracts: undefined,
      addSubscription: function () {
        assert.fail();
      }
    },
    assertions: function (message) {
      assert.strictEqual(message, "0x42");
    }
  });
});
