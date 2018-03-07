/* eslint-env mocha */

"use strict";

var os = require("os");
var assert = require("chai").assert;
var immutableDelete = require("immutable-delete");
var proxyquire = require("proxyquire").noPreserveCache();
var StubServer = require("ethereumjs-stub-rpc-server");
var connect = require("../src/connect");

describe("connect", function () {
  var test = function (t) {
    describe(t.description, function () {
      it("async", function (done) {
        proxyquire("../src/connect.js", {
          "./async-connect": function (rpc, configuration, callback) {
            callback(null, {
              http: configuration.http,
              ws: configuration.ws,
              ipc: configuration.ipc
            });
          }
        })(t.params.options, function (err, vitals) {
          t.assertions(vitals);
          done();
        });
      });
    });
  };
  test({
    description: "no endpoints specified",
    params: {
      options: {
        contracts: {}
      }
    },
    assertions: function (vitals) {
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        http: undefined,
        ws: undefined,
        ipc: undefined
      });
    }
  });
  test({
    description: "http only",
    params: {
      options: {
        http: "http://127.0.0.1:8545",
        ws: null,
        ipc: null,
        contracts: {}
      }
    },
    assertions: function (vitals) {
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        http: "http://127.0.0.1:8545",
        ws: null,
        ipc: null
      });
    }
  });
  test({
    description: "http and websockets",
    params: {
      options: {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: null,
        contracts: {}
      }
    },
    assertions: function (vitals) {
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: null
      });
    }
  });
  test({
    description: "http and ipc",
    params: {
      options: {
        http: "http://127.0.0.1:8545",
        ws: null,
        ipc: "/home/jack/.ethereum/geth.ipc",
        contracts: {}
      }
    },
    assertions: function (vitals) {
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        http: "http://127.0.0.1:8545",
        ws: null,
        ipc: "/home/jack/.ethereum/geth.ipc"
      });
    }
  });
  test({
    description: "http, websockets, and ipc",
    params: {
      options: {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: "/home/jack/.ethereum/geth.ipc",
        contracts: {}
      }
    },
    assertions: function (vitals) {
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        http: "http://127.0.0.1:8545",
        ws: "ws://127.0.0.1:8546",
        ipc: "/home/jack/.ethereum/geth.ipc"
      });
    }
  });
});

function connectTest(transportType, transportAddress) {
  /** @type {StubServer.AbstractServer} */
  var server;
  beforeEach(function () {
    server = new StubServer.createStubServer(transportType, transportAddress);
  });
  afterEach(function (done) {
    server.destroy(done);
  });

  it("connects with array options", function (done) {
    var connectOptions = {
      contracts: {},
      abi: {}
    };
    switch (transportType) {
      case "HTTP":
        connectOptions.httpAddresses = [transportAddress];
        break;
      case "WS":
        connectOptions.wsAddresses = [transportAddress];
        break;
      case "IPC":
        connectOptions.ipcAddresses = [transportAddress];
        break;
      default:
        throw new Error("Unknown transport type: " + transportType);
    }
    server.addResponder(function (jso) { if (jso.method === "eth_coinbase") return "0x123456789abcdef123456789abcdef"; });
    server.addResponder(function (jso) { if (jso.method === "eth_gasPrice") return "0x123"; });
    server.addResponder(function (jso) { if (jso.method === "eth_blockNumber") return "0x1"; });
    server.addResponder(function (jso) { if (jso.method === "eth_getBlockByNumber") return { number: "0x1", parentHash: "0x2", hash: "0x3" }; });
    server.addResponder(function (jso) { if (jso.method === "net_version") return "apple"; });
    connect(connectOptions, function (err, vitals) {
      assert.isNull(err);
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        coinbase: "0x123456789abcdef123456789abcdef",
        networkID: "apple",
        blockNumber: "0x1",
        gasPrice: 291,
        contracts: {},
        abi: {}
      });
      done();
    });
  });

  function test(t) {
    it(t.description, function (done) {
      var connectOptions;
      server.addResponder(function (jso) { if (jso.method === "eth_coinbase") return t.blockchain.coinbase; });
      server.addResponder(function (jso) { if (jso.method === "eth_gasPrice") return t.blockchain.gasPrice; });
      server.addResponder(function (jso) { if (jso.method === "net_version") return t.blockchain.networkID; });
      server.addResponder(function (jso) { if (jso.method === "eth_blockNumber") return t.blockchain.blockNumber; });
      server.addResponder(function (jso) { if (jso.method === "eth_getBlockByNumber") return t.blockchain.currentBlock; });
      connectOptions = {
        http: (transportType === "HTTP") ? transportAddress : undefined,
        ws: (transportType === "WS") ? transportAddress : undefined,
        ipc: (transportType === "IPC") ? transportAddress : undefined,
        contracts: t.contracts,
        abi: t.abi
      };
      connect(connectOptions, function (err, vitals) {
        t.assertions(vitals);
        done();
      });
    });
  }
  test({
    description: "asynchronous connection sequence without abi",
    blockchain: {
      coinbase: "0xb0b",
      gasPrice: "0x4a817c801",
      networkID: "3",
      blockNumber: "0x1",
      currentBlock: { number: "0x1", parentHash: "0x2", hash: "0x3" }
    },
    contracts: {
      3: {
        contract1: "0xc1",
        contract2: "0xc2"
      }
    },
    assertions: function (vitals) {
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        coinbase: "0xb0b",
        networkID: "3",
        blockNumber: "0x1",
        gasPrice: 20000000001,
        contracts: { contract1: "0xc1", contract2: "0xc2" },
        abi: {}
      });
    }
  });
  test({
    description: "asynchronous connection sequence with abi",
    blockchain: {
      coinbase: "0xb0b",
      gasPrice: "0x4a817c801",
      networkID: "3",
      blockNumber: "0x1",
      currentBlock: { number: "0x1", parentHash: "0x2", hash: "0x3" }
    },
    contracts: {
      3: { contract1: "0xc1", contract2: "0xc2" }
    },
    abi: {
      events: {
        contract1: {
          event1: { contract: "contract1" },
          event2: { contract: "contract1" }
        },
        contract2: {
          event3: { contract: "contract2" }
        }
      },
      functions: {
        contract1: { method1: {}, method2: {} },
        contract2: { method1: {} }
      }
    },
    assertions: function (vitals) {
      assert.deepEqual(immutableDelete(vitals, "rpc"), {
        coinbase: "0xb0b",
        networkID: "3",
        blockNumber: "0x1",
        gasPrice: 20000000001,
        contracts: { contract1: "0xc1", contract2: "0xc2" },
        abi: {
          events: {
            contract1: {
              event1: { address: "0xc1", contract: "contract1" },
              event2: { address: "0xc1", contract: "contract1" }
            },
            contract2: {
              event3: { address: "0xc2", contract: "contract2" }
            }
          },
          functions: {
            contract1: { method1: { from: "0xb0b", to: "0xc1" }, method2: { from: "0xb0b", to: "0xc1" } },
            contract2: { method1: { from: "0xb0b", to: "0xc2" } }
          }
        }
      });
    }
  });
}

describe("async connect", function () {
  describe("HTTP", connectTest.bind(null, "HTTP", "http://localhost:1337"));
  describe("WS", connectTest.bind(null, "WS", "ws://localhost:1337"));
  describe("IPC", connectTest.bind(null, "IPC", (os.type() === "Windows_NT") ? "\\\\.\\pipe\\TestRPC" : "testrpc.ipc"));
});
