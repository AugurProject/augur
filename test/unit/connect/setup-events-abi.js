/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var setupEventsAbi = require("../../../src/connect/setup-events-abi");

describe("connect/setup-events-abi", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(setupEventsAbi(t.params.eventsAbi, t.params.contracts));
    });
  };
  test({
    description: "set up events ABI",
    params: {
      eventsAbi: {
        contract1: {
          event1: { contract: "contract1" },
          event2: { contract: "contract1" },
        },
        contract2: {
          event3: { contract: "contract2" },
        },
      },
      contracts: {
        contract1: "0xc1",
        contract2: "0xc2",
      },
    },
    assertions: function (eventsAbi) {
      assert.deepEqual(eventsAbi, {
        contract1: {
          event1: { address: "0xc1", contract: "contract1" },
          event2: { address: "0xc1", contract: "contract1" },
        },
        contract2: {
          event3: { address: "0xc2", contract: "contract2" },
        },
      });
    },
  });
  test({
    description: "modify existing events ABI",
    params: {
      eventsAbi: {
        contract1: {
          event1: { address: "0xC1", contract: "contract1" },
          event2: { address: "0xC1", contract: "contract1" },
        },
        contract2: {
          event3: { address: "0xC2", contract: "contract2" },
        },
      },
      contracts: {
        contract1: "0xc1",
        contract2: "0xc2",
      },
    },
    assertions: function (eventsAbi) {
      assert.deepEqual(eventsAbi, {
        contract1: {
          event1: { address: "0xc1", contract: "contract1" },
          event2: { address: "0xc1", contract: "contract1" },
        },
        contract2: {
          event3: { address: "0xc2", contract: "contract2" },
        },
      });
    },
  });
});
