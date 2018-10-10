/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("events/stop-blockchain-event-listeners", function () {
  var test = function (t) {
    it(t.description, function () {
      var stopBlockListeners = proxyquire("../../../src/events/stop-blockchain-event-listeners", {
        "./subscriptions": t.stub.subscriptions,
        "../rpc-interface": t.stub.rpcInterface,
      });
      t.assertions(stopBlockListeners());
    });
  };
  test({
    description: "happy path",
    stub: {
      subscriptions: {
        getSubscriptions: function () {
          return {
            LOG_SUBSCRIPTION_TOKEN_1: noop,
            LOG_SUBSCRIPTION_TOKEN_2: noop,
            block: { added: noop, removed: noop },
          };
        },
        removeSubscription: function (token) {
          assert.oneOf(token, ["LOG_SUBSCRIPTION_TOKEN_1", "LOG_SUBSCRIPTION_TOKEN_2"]);
        },
      },
      rpcInterface: {
        getBlockStream: function () {
          return {
            onLogAddedSubscribers: { ON_LOG_ADDED_TOKEN: noop },
            onLogRemovedSubscribers: { ON_LOG_REMOVED_TOKEN: noop },
            logFilters: { LOG_SUBSCRIPTION_TOKEN_1: noop, LOG_SUBSCRIPTION_TOKEN_2: noop },
            removeLogFilter: function (token) {
              assert.oneOf(token, ["LOG_SUBSCRIPTION_TOKEN_1", "LOG_SUBSCRIPTION_TOKEN_2"]);
            },
            unsubscribeFromOnLogAdded: function (token) {
              assert.strictEqual(token, "ON_LOG_ADDED_TOKEN");
            },
            unsubscribeFromOnLogRemoved: function (token) {
              assert.strictEqual(token, "ON_LOG_REMOVED_TOKEN");
            },
          };
        },
      },
    },
    assertions: function (isStopped) {
      assert.isTrue(isStopped);
    },
  });
});
