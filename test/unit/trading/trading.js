/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var clone = require("clone");
var augurpath = "../../../src/index";
var augur = require(augurpath);
var utils = require("../../../src/utilities");
var tools = require("../../tools");
var errors = require("augur-contracts").errors;
var trade = require("../../../src/modules/trade");
var DEBUG = false;

describe("trade.isUnderGasLimit", function () {
  before(function () {
    trade.rpc = {
      blockNumber: function (callback) {
        if (!utils.is_function(callback)) return "0x1";
        callback("0x1");
      },
    };
  });
  after(function () { delete trade.rpc; });
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      trade.rpc.getBlock = function (blockNumber, pending, callback) {
        if (!utils.is_function(callback)) return {gasLimit: abi.hex(t.gasLimit)};
        callback({gasLimit: abi.hex(t.gasLimit)});
      };
      assert.strictEqual(trade.isUnderGasLimit(t.tradeTypes, t.gasLimit), t.expected);
      assert.strictEqual(trade.isUnderGasLimit(t.tradeTypes), t.expected);
      trade.isUnderGasLimit(t.tradeTypes, t.gasLimit, function (isUnderGasLimit) {
        assert.strictEqual(isUnderGasLimit, t.expected);
        trade.isUnderGasLimit(t.tradeTypes, function (isUnderGasLimit) {
          assert.strictEqual(isUnderGasLimit, t.expected);
          trade.isUnderGasLimit(t.tradeTypes, null, function (isUnderGasLimit) {
            assert.strictEqual(isUnderGasLimit, t.expected);
            done();
          });
        });
      });
    });
  };
  test({
    tradeTypes: ["buy"],
    gasLimit: 3135000,
    expected: true
  });
  test({
    tradeTypes: ["sell", "buy"],
    gasLimit: 3135000,
    expected: true
  });
  test({
    tradeTypes: ["buy", "buy", "sell"],
    gasLimit: 3135000,
    expected: true
  });
  test({
    tradeTypes: ["sell", "buy", "sell", "buy"],
    gasLimit: 3135000,
    expected: true
  });
  test({
    tradeTypes: ["buy", "sell", "sell", "buy", "buy"],
    gasLimit: 3135000,
    expected: false
  });
  test({
    tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell"],
    gasLimit: 3135000,
    expected: false
  });
  test({
    tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell", "sell"],
    gasLimit: 3135000,
    expected: false
  });
  test({
    tradeTypes: ["buy", "buy", "buy", "buy", "buy", "buy", "buy"],
    gasLimit: 3135000,
    expected: false
  });
  test({
    tradeTypes: ["buy"],
    gasLimit: 4712388,
    expected: true
  });
  test({
    tradeTypes: ["sell", "buy"],
    gasLimit: 4712388,
    expected: true
  });
  test({
    tradeTypes: ["buy", "buy", "sell"],
    gasLimit: 4712388,
    expected: true
  });
  test({
    tradeTypes: ["sell", "buy", "sell", "buy"],
    gasLimit: 4712388,
    expected: true
  });
  test({
    tradeTypes: ["buy", "sell", "sell", "buy", "buy"],
    gasLimit: 4712388,
    expected: true
  });
  test({
    tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell"],
    gasLimit: 4712388,
    expected: true
  });
  test({
    tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell", "sell"],
    gasLimit: 4712388,
    expected: true
  });
  test({
    tradeTypes: ["buy", "buy", "buy", "buy", "buy", "buy", "buy"],
    gasLimit: 4712388,
    expected: false
  });
});

describe("trade.checkGasLimit", function () {
  this.timeout(tools.TIMEOUT);
  var mockTrades = {
    "0x1": {id: "0x1", type: "buy", owner: "0x1001001"},
    "0x2": {id: "0x2", type: "buy", owner: "0xdeadbeef"},
    "0x3": {id: "0x3", type: "buy", owner: "0xdeadbeef"},
    "0x4": {id: "0x4", type: "buy", owner: "0xdeadbeef"},
    "0x5": {id: "0x5", type: "buy", owner: "0xdeadbeef"},
    "0x6": {id: "0x6", type: "buy", owner: "0xdeadbeef"},
    "0x7": {id: "0x7", type: "buy", owner: "0xdeadbeef"},
    "0x8": {id: "0x8", type: "buy", owner: "0xdeadbeef"},
    "0x9": {id: "0x9", type: "sell", owner: "0xdeadbeef"},
    "0x10": {id: "0x10", type: "sell", owner: "0xdeadbeef"},
    "0x11": {id: "0x11", type: "sell", owner: "0xdeadbeef"},
    "0x12": {id: "0x12", type: "sell", owner: "0xdeadbeef"},
    "0x13": {id: "0x13", type: "sell", owner: "0xdeadbeef"},
    "0x14": {id: "0x14", type: "sell", owner: "0xdeadbeef"},
    "0x15": {id: "0x15", type: "sell", owner: "0xdeadbeef"},
    "0x16": {id: "0x16", type: "sell", owner: "0xdeadbeef"}
  }
  var checkGasLimit = augur.checkGasLimit;
  before(function () {
    trade.rpc = {
      blockNumber: function (callback) {
        callback("0x1");
      }
    };
    trade.get_trade = function (trade_id, callback) {
      callback(mockTrades[trade_id]);
    };
    trade.errors = clone(errors);
  });
  after(function () {
    delete trade.rpc;
    delete trade.get_trade;
  });
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      trade.rpc.getBlock = function (blockNumber, pending, callback) {
        callback({gasLimit: t.gasLimit});
      };
      trade.checkGasLimit(t.trade_ids, t.sender, function (err, trade_ids) {
        assert.deepEqual(err, t.expected.error);
        assert.deepEqual(trade_ids, t.expected.trade_ids);
        done();
      });
    });
  };
  test({
    gasLimit: "0x47e7c4",
    sender: "0x42",
    trade_ids: ["0x1", "0x2", "0x3", "0x4"],
    expected: {
      error: null,
      trade_ids: ["0x1", "0x2", "0x3", "0x4"]
    }
  });
  test({
    gasLimit: "0x47e7c4",
    sender: "0x42",
    trade_ids: ["0x13", "0x14", "0x15", "0x16"],
    expected: {
      error: null,
      trade_ids: ["0x13", "0x14", "0x15", "0x16"]
    }
  });
  test({
    gasLimit: "0x47e7c4",
    sender: "0x42",
    trade_ids: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7", "0x8"],
    expected: {
      error: null,
      trade_ids: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6"]
    }
  });
  test({
    gasLimit: "0x47e7c4",
    sender: "0x42",
    trade_ids: ["0x9", "0x10", "0x11", "0x12", "0x13", "0x14", "0x15", "0x16"],
    expected: {
      error: null,
      trade_ids: ["0x9", "0x10", "0x11", "0x12", "0x13", "0x14", "0x15"]
    }
  });
  test({
    gasLimit: "0x47e7c4",
    sender: "0x42",
    trade_ids: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7", "0x9"],
    expected: {
      error: errors.GAS_LIMIT_EXCEEDED,
      trade_ids: undefined
    }
  });
});
