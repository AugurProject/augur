/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var createEthrpcConfiguration = require("../../../src/connect/create-ethrpc-configuration");

describe("connect/create-ethrpc-configuration", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(createEthrpcConfiguration(t.params.configuration));
    });
  };
  test({
    description: "create ethrpc configuration",
    params: {
      configuration: {
        http: "http://somewhere:1234",
        ws: "ws://somewhere.else:5678",
        ipc: null,
        api: { events: null, functions: null },
        contracts: { 3: { contract1: "0xc1", contract2: "0xc2" } },
        httpAddresses: ["http://somewhere:1234"],
        wsAddresses: ["ws://somewhere.else:5678"],
        ipcAddresses: [],
      },
    },
    assertions: function (ethrpcConfiguration) {
      assert.deepEqual(ethrpcConfiguration.httpAddresses, ["http://somewhere:1234"]);
      assert.deepEqual(ethrpcConfiguration.wsAddresses, ["ws://somewhere.else:5678"]);
      assert.deepEqual(ethrpcConfiguration.ipcAddresses, []);
    },
  });
});
