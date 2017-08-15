/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache().noCallThru();

describe("contracts/generate-abi-map", function () {
  var test = function (t) {
    it(t.description, function () {
      var generateAbiMap = proxyquire("../../../src/contracts/generate-abi-map", {
        "./abi": t.mock.abi
      });
      t.assertions(generateAbiMap());
    });
  };
  test({
    description: "convert standard JSON ABI to custom map",
    mock: {
      abi: {
        Contract1: [{
          "constant": false,
          "type": "function",
          "name": "allowance(address,address)",
          "outputs": [{
            "type": "uint256",
            "name": "out"
          }],
          "inputs": [{
            "type": "address",
            "name": "owner"
          }, {
            "type": "address",
            "name": "spender"
          }]
        }, {
          "constant": false,
          "type": "function",
          "name": "approve(address,uint256)",
          "outputs": [{
            "type": "uint256",
            "name": "out"
          }],
          "inputs": [{
            "type": "address",
            "name": "spender"
          }, {
            "type": "uint256",
            "name": "fxpAmount"
          }]
        }],
        Contract2: [{
          "constant": false,
          "type": "function",
          "name": "balanceOf(address)",
          "outputs": [{
            "type": "uint256",
            "name": "fxp"
          }],
          "inputs": [{
            "type": "address",
            "name": "address"
          }]
        }, {
          "inputs": [{
            "indexed": true,
            "type": "address",
            "name": "from"
          }, {
            "indexed": true,
            "type": "address",
            "name": "to"
          }, {
            "indexed": false,
            "type": "uint256",
            "name": "value"
          }],
          "type": "event",
          "name": "Transfer(address,address,uint256)"
        }]
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        events: {
          Transfer: {
            contract: "Contract2",
            inputs: [{
              indexed: true,
              type: "address",
              name: "from"
            }, {
              indexed: true,
              type: "address",
              name: "to"
            }, {
              indexed: false,
              type: "uint256",
              name: "value"
            }],
            signature: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
          }
        },
        functions: {
          Contract1: {
            allowance: {
              constant: false,
              name: "allowance(address,address)",
              returns: "uint256",
              inputs: ["owner", "spender"],
              signature: ["address", "address"]
            },
            approve: {
              constant: false,
              name: "approve(address,uint256)",
              returns: "uint256",
              inputs: ["spender", "fxpAmount"],
              signature: ["address", "uint256"],
              fixed: [1]
            }
          },
          Contract2: {
            balanceOf: {
              constant: false,
              name: "balanceOf(address)",
              returns: "unfix",
              inputs: ["address"],
              signature: ["address"]
            }
          }
        }
      })
    }
  });
});
