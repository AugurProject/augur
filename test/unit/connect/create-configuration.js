/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var createConfiguration = require("../../../src/connect/create-configuration");

describe("connect/create-configuration", function () {
  var test = function (t) {
    it(t.description, function () {
      Object.freeze(t.params.options.httpAddresses);
      Object.freeze(t.params.options.wsAddresses);
      Object.freeze(t.params.options.ipcAddresses);
      t.assertions(createConfiguration(t.params.options));
    });
  };
  test({
    description: "http-only without api",
    params: {
      options: {
        http: "http://somewhere:1234",
        httpAddresses: [],
        ws: null,
        ipc: null,
        api: { events: null, functions: null },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
      },
    },
    assertions: function (configuration) {
      assert.deepEqual(configuration, {
        http: "http://somewhere:1234",
        ws: null,
        ipc: null,
        api: { events: null, functions: null },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
        httpAddresses: ["http://somewhere:1234"],
        wsAddresses: [],
        ipcAddresses: [],
      });
    },
  });
  test({
    description: "http-only with api",
    params: {
      options: {
        http: "http://127.0.0.1:8545",
        ws: null,
        ipc: null,
        api: {
          events: {
            event1: { contract: "contract1" },
            event2: { contract: "contract1" },
            event3: { contract: "contract2" },
          },
          functions: {
            contract1: { method1: {}, method2: {} },
            contract2: { method1: {} },
          },
        },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
      },
    },
    assertions: function (configuration) {
      assert.deepEqual(configuration, {
        http: "http://127.0.0.1:8545",
        ws: null,
        ipc: null,
        api: {
          events: {
            event1: { contract: "contract1" },
            event2: { contract: "contract1" },
            event3: { contract: "contract2" },
          },
          functions: {
            contract1: { method1: {}, method2: {} },
            contract2: { method1: {} },
          },
        },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
        httpAddresses: ["http://127.0.0.1:8545"],
        wsAddresses: [],
        ipcAddresses: [],
      });
    },
  });
  test({
    description: "http and websockets with api",
    params: {
      options: {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: null,
        api: {
          events: {
            event1: { contract: "contract1" },
            event2: { contract: "contract1" },
            event3: { contract: "contract2" },
          },
          functions: {
            contract1: { method1: {}, method2: {} },
            contract2: { method1: {} },
          },
        },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
      },
    },
    assertions: function (configuration) {
      assert.deepEqual(configuration, {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: null,
        api: {
          events: {
            event1: { contract: "contract1" },
            event2: { contract: "contract1" },
            event3: { contract: "contract2" },
          },
          functions: {
            contract1: { method1: {}, method2: {} },
            contract2: { method1: {} },
          },
        },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
        httpAddresses: ["http://127.0.0.1:8545"],
        wsAddresses: ["ws://127.0.0.1:8546"],
        ipcAddresses: [],
      });
    },
  });
  test({
    description: "http, websockets, and ipc with api",
    params: {
      options: {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: "/home/jack/.ethereum/geth.ipc",
        api: {
          events: {
            event1: { contract: "contract1" },
            event2: { contract: "contract1" },
            event3: { contract: "contract2" },
          },
          functions: {
            contract1: { method1: {}, method2: {} },
            contract2: { method1: {} },
          },
        },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
      },
    },
    assertions: function (configuration) {
      assert.deepEqual(configuration, {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: "/home/jack/.ethereum/geth.ipc",
        api: {
          events: {
            event1: { contract: "contract1" },
            event2: { contract: "contract1" },
            event3: { contract: "contract2" },
          },
          functions: {
            contract1: { method1: {}, method2: {} },
            contract2: { method1: {} },
          },
        },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
        httpAddresses: ["http://127.0.0.1:8545"],
        wsAddresses: ["ws://127.0.0.1:8546"],
        ipcAddresses: ["/home/jack/.ethereum/geth.ipc"],
      });
    },
  });
  test({
    description: "Ignore blank URLs",
    params: {
      options: {
        http: "http://somewhere:1234",
        httpAddresses: [],
        ws: "",
        ipc: null,
        api: { events: null, functions: null },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
      },
    },
    assertions: function (configuration) {
      assert.deepEqual(configuration, {
        http: "http://somewhere:1234",
        ws: "",
        ipc: null,
        api: { events: null, functions: null },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
        httpAddresses: ["http://somewhere:1234"],
        wsAddresses: [],
        ipcAddresses: [],
      });
    },
  });
});
