/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("events/start-augur-node-event-listeners", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var startAugurNodeEventListeners = proxyquire("../../../src/events/start-augur-node-event-listeners", {
        "../augur-node": t.stub.augurNode,
      });
      startAugurNodeEventListeners(t.params, function (err) {
        t.assertions(err);
        done();
      });
    });
  };
  test({
    description: "happy path",
    params: {
      TestEventName1: noop,
      TestEventName2: noop,
      TestEventName3: noop,
    },
    stub: {
      augurNode: {
        subscribeToEvent: function (eventName, subscriptionCallback, onComplete) {
          assert.oneOf(eventName, ["TestEventName1", "TestEventName2", "TestEventName3"]);
          assert.strictEqual(subscriptionCallback, noop);
          assert.isFunction(onComplete);
          onComplete(null);
        },
      },
    },
    assertions: function (err) {
      assert.isNull(err);
    },
  });
});
