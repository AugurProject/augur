/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var encodeTransactionInputs = require("../../../src/api/encode-transaction-inputs");

describe("api/encode-transaction-inputs", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(encodeTransactionInputs(t.params.p, t.params.inputs, t.params.signature, t.params.fixedPointIndex));
    });
  };
  test({
    description: "encode transaction inputs of various types",
    params: {
      p: {
        addressInput: "b0b",
        int256Input: "10",
        uint256Input: 10,
        bytes32Input: "0xdeadbeef",
        addressArrayInput: ["d00d", "b0b", "beef"],
        int256ArrayInput: ["10", 10, "0xa"],
        uint256ArrayInput: ["10", 10, "0xa"],
        bytes32ArrayInput: ["0xdeadbeef", "10", 10],
        bytesInput: "hello world"
      },
      inputs: [
        "addressInput",
        "int256Input",
        "uint256Input",
        "bytes32Input",
        "addressArrayInput",
        "int256ArrayInput",
        "uint256ArrayInput",
        "bytes32ArrayInput",
        "bytesInput"
      ],
      signature: [
        "address",
        "int256",
        "uint256",
        "bytes32",
        "address[]",
        "int256[]",
        "uint256[]",
        "bytes32[]",
        "bytes"
      ],
      fixedPointIndex: undefined
    },
    assertions: function (encodedTransactionInputs) {
      assert.isArray(encodedTransactionInputs);
      assert.strictEqual(encodedTransactionInputs.length, 9);
      assert.deepEqual(encodedTransactionInputs, [
        "0x0000000000000000000000000000000000000b0b",
        "0x0000000000000000000000000000000000000000000000000000000000000010",
        "0x000000000000000000000000000000000000000000000000000000000000000a",
        "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        [
          "0x000000000000000000000000000000000000d00d",
          "0x0000000000000000000000000000000000000b0b",
          "0x000000000000000000000000000000000000beef"
        ],
        [
          "0x0000000000000000000000000000000000000000000000000000000000000010",
          "0x000000000000000000000000000000000000000000000000000000000000000a",
          "0x000000000000000000000000000000000000000000000000000000000000000a"
        ],
        [
          "0x0000000000000000000000000000000000000000000000000000000000000010",
          "0x000000000000000000000000000000000000000000000000000000000000000a",
          "0x000000000000000000000000000000000000000000000000000000000000000a"
        ],
        [
          "0x00000000000000000000000000000000000000000000000000000000deadbeef",
          "0x0000000000000000000000000000000000000000000000000000000000000010",
          "0x000000000000000000000000000000000000000000000000000000000000000a"
        ],
        "hello world"
      ]);
    }
  });
  test({
    description: "encode transaction inputs including fixed-point conversions",
    params: {
      p: {
        input1: 10,
        input2: 100,
        input3: 1000,
        input4: 10000
      },
      inputs: ["input1", "input2", "input3", "input4"],
      signature: ["int256", "int256", "int256", "int256"],
      fixedPointIndex: [1, 2]
    },
    assertions: function (encodedTransactionInputs) {
      assert.isArray(encodedTransactionInputs);
      assert.strictEqual(encodedTransactionInputs.length, 4);
      assert.deepEqual(encodedTransactionInputs, [
        "0x000000000000000000000000000000000000000000000000000000000000000a",
        "0x0000000000000000000000000000000000000000000000056bc75e2d63100000",
        "0x00000000000000000000000000000000000000000000003635c9adc5dea00000",
        "0x0000000000000000000000000000000000000000000000000000000000002710"
      ]);
    }
  });
});
