/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var generateAbiMap = require("../../../src/contracts/generate-abi-map");

describe("contracts/generate-abi-map", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(generateAbiMap(t.params.abi));
    });
  };
  test({
    description: "convert standard JSON ABI to custom map",
    params: {
      abi: {
        Contract1: [{
          "constant": false,
          "type": "function",
          "name": "allowance",
          "inputs": [{
            "type": "address",
            "name": "owner",
          }, {
            "type": "address",
            "name": "spender",
          }],
        }, {
          "constant": false,
          "type": "function",
          "name": "approve",
          "outputs": [{
            "type": "uint256",
            "name": "out",
          }],
          "inputs": [{
            "type": "address",
            "name": "spender",
          }, {
            "type": "uint256",
            "name": "fxpAmount",
          }],
        }],
        Contract2: [{
          "constant": false,
          "type": "function",
          "name": "balanceOf",
          "outputs": [{
            "type": "uint256",
            "name": "fxp",
          }],
          "inputs": [{
            "type": "address",
            "name": "address",
          }],
        }, {
          "inputs": [{
            "indexed": true,
            "type": "address",
            "name": "from",
          }, {
            "indexed": true,
            "type": "address",
            "name": "to",
          }, {
            "indexed": false,
            "type": "uint256",
            "name": "value",
          }],
          "type": "event",
          "name": "Transfer",
        }],
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        events: {
          Contract2: {
            Transfer: {
              contract: "Contract2",
              inputs: [{
                indexed: true,
                type: "address",
                name: "from",
              }, {
                indexed: true,
                type: "address",
                name: "to",
              }, {
                indexed: false,
                type: "uint256",
                name: "value",
              }],
              signature: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            },
          },
        },
        functions: {
          Contract1: {
            allowance: {
              constant: false,
              name: "allowance",
              returns: "null",
              inputs: ["owner", "spender"],
              signature: ["address", "address"],
            },
            approve: {
              constant: false,
              name: "approve",
              returns: "uint256",
              inputs: ["spender", "fxpAmount"],
              signature: ["address", "uint256"],
            },
          },
          Contract2: {
            balanceOf: {
              constant: false,
              name: "balanceOf",
              returns: "uint256",
              inputs: ["address"],
              signature: ["address"],
            },
          },
        },
      });
    },
  });
});
