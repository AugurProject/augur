/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var augur = require("../../../src");
var constants = require("../../../src/constants");
var utils = require("../../../src/utilities");

describe("register", function () {

  var tx, api, getLogs;

  before(function () {
    api = augur.api;
    tx = augur.tx;
    getLogs = augur.rpc.getLogs;
    augur.api = new require("augur-contracts").Tx(constants.DEFAULT_NETWORK_ID);
    augur.tx = augur.api.functions;
  });

  after(function () {
    augur.api = api;
    augur.tx = tx;
    augur.rpc.getLogs = getLogs;
  });

  describe("parseLastBlockNumber: parse last block from session logs", function () {
    var test = function (t) {
      it(t.description, function () {
        t.assertions(augur.parseLastBlockNumber(t.logs));
      });
    };
    test({
      description: "1 session log",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ],
        blockNumber: "0x1"
      }],
      assertions: function (output) {
        assert.strictEqual(output, 1);
      }
    });
    test({
      description: "2 session logs",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ],
        blockNumber: "0x1"
      }, {
        data: "0x0000000000000000000000000000000000000000000000000000000057db1716",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ],
        blockNumber: "0x2"
      }],
      assertions: function (output) {
        assert.strictEqual(output, 2);
      }
    });
  });

  describe("getRegisterBlockNumber: look up user's most recent register block number", function () {
    var test = function (t) {
      it(t.description, function (done) {
        augur.rpc.getLogs = function (filter, callback) {
          if (!callback) return t.logs;
          callback(t.logs);
        };
        augur.getRegisterBlockNumber(t.account, t.options, function (err, blockNumber) {
          assert.isNull(err);
          t.assertions({
            async: blockNumber,
            sync: augur.getRegisterBlockNumber(t.account, t.options)
          });
          done();
        });
      });
    };
    test({
      description: "no registers",
      account: "0xbob",
      logs: [],
      assertions: function (output) {
        assert.isObject(output);
        assert.isNull(output.sync);
        assert.isNull(output.async);
      }
    });
    test({
      description: "1 register",
      account: "0xb0b",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ],
        blockNumber: "0x2"
      }],
      assertions: function (output) {
        assert.isObject(output);
        assert.strictEqual(output.sync.constructor, Number);
        assert.strictEqual(output.async.constructor, Number);
        assert.strictEqual(output.sync, output.async);
        assert.strictEqual(output.async, 2);
      }
    });
    test({
      description: "2 registers",
      account: "0xb0b",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ],
        blockNumber: "0x1"
      }, {
        data: "0x0000000000000000000000000000000000000000000000000000000057db1716",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ],
        blockNumber: "0x2"
      }],
      assertions: function (output) {
        assert.isObject(output);
        assert.strictEqual(output.sync.constructor, Number);
        assert.strictEqual(output.async.constructor, Number);
        assert.strictEqual(output.sync, output.async);
        assert.strictEqual(output.async, 2);
      }
    });
  });
});
