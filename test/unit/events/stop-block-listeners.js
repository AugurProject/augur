/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("events/stop-block-listeners", function () {
  var test = function (t) {
    it(t.description, function () {
      var stopBlockListeners = proxyquire("../../../src/events/stop-block-listeners", {
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
            block: {
              added: "ON_BLOCK_ADDED_TOKEN",
              removed: "ON_BLOCK_REMOVED_TOKEN",
            },
          };
        },
        removeOnBlockAddedSubscription: noop,
        removeOnBlockRemovedSubscription: noop,
      },
      rpcInterface: {
        getBlockStream: function () {
          return {
            unsubscribeFromOnBlockAdded: function (token) {
              assert.strictEqual(token, "ON_BLOCK_ADDED_TOKEN");
            },
            unsubscribeFromOnBlockRemoved: function (token) {
              assert.strictEqual(token, "ON_BLOCK_REMOVED_TOKEN");
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
