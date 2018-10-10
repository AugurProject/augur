/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("events/start-block-listeners", function () {
  var test = function (t) {
    it(t.description, function () {
      var startBlockListeners = proxyquire("../../../src/events/start-block-listeners", {
        "./subscriptions": t.stub.subscriptions,
        "../rpc-interface": t.stub.rpcInterface,
      });
      t.assertions(startBlockListeners(t.params));
    });
  };
  test({
    description: "happy path",
    params: {
      onAdded: noop,
      onRemoved: noop,
    },
    stub: {
      subscriptions: {
        addOnBlockAddedSubscription: function (token) {
          assert.strictEqual(token, "ON_BLOCK_ADDED_TOKEN");
        },
        addOnBlockRemovedSubscription: function (token) {
          assert.strictEqual(token, "ON_BLOCK_REMOVED_TOKEN");
        },
      },
      rpcInterface: {
        getBlockStream: function () {
          return {
            subscribeToOnBlockAdded: function (callback) {
              assert.isFunction(callback);
              return "ON_BLOCK_ADDED_TOKEN";
            },
            subscribeToOnBlockRemoved: function (callback) {
              assert.isFunction(callback);
              return "ON_BLOCK_REMOVED_TOKEN";
            },
          };
        },
      },
    },
    assertions: function (isStarted) {
      assert.isTrue(isStarted);
    },
  });
});
