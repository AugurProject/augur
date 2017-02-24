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
var errors = require("ethrpc").errors;
var trade = require("../../../src/modules/trade");
var DEBUG = false;

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
      trade.rpc = {
        block: {number: 1, gasLimit: t.gasLimit}
      };
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

describe("trade.parseTradeReceipt", function() {
  // 6 tests total
  var test = function(t) {
    it(JSON.stringify(t), function() {
      t.assertions(augur.parseTradeReceipt(t.receipt));
    });
  };
  test({
    receipt: {},
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        sharesBought: '0',
        cashFromTrade: '0',
        tradingFees: '0'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [],
        data: ''
      }],
    },
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        sharesBought: '0',
        cashFromTrade: '0',
        tradingFees: '0'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [augur.api.events.log_fill_tx.signature],
        data: ['1', 'notUsed', abi.fix('10').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.03').toString(), 'notUsed', abi.fix('-5')]
      }],
    },
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        sharesBought: '10',
        cashFromTrade: '0',
        tradingFees: '0.03'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [augur.api.events.log_fill_tx.signature],
        data: ['1', 'notUsed', abi.fix('10').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.03').toString(), 'notUsed', abi.fix('-5')]
      }, {
        topics: [augur.api.events.log_fill_tx.signature],
        data: ['1', 'notUsed', abi.fix('20').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.03').toString(), 'notUsed', abi.fix('-10')]
      }],
    },
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        sharesBought: '30',
        cashFromTrade: '0',
        tradingFees: '0.06'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [augur.api.events.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('100').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.5')]
      }],
    },
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        sharesBought: '0',
        cashFromTrade: '50',
        tradingFees: '0.02'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [augur.api.events.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('100').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.5')]
      },
      {
        topics: [augur.api.events.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('400').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.25')]
      },
      {
        topics: [augur.api.events.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('250').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.2')]
      }],
    },
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        sharesBought: '0',
        cashFromTrade: '200',
        tradingFees: '0.06'
      });
    }
  });
});

describe("trade.parseShortSellReceipt", function() {
  // 6 tests total
  var test = function(t) {
    it(JSON.stringify(t), function() {
      t.assertions(augur.parseShortSellReceipt(t.receipt));
    });
  };
  test({
    receipt: {},
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        cashFromTrade: '0',
        tradingFees: '0'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [],
        data: ''
      }],
    },
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        cashFromTrade: '0',
        tradingFees: '0'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [augur.api.events.log_short_fill_tx.signature],
        data: ['notUsed', abi.fix('100').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', 'notUsed', abi.fix('0.5')]
      },
      {
        topics: [augur.api.events.log_short_fill_tx.signature],
        data: ['notUsed', abi.fix('400').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', 'notUsed', abi.fix('0.25')]
      },
      {
        topics: [augur.api.events.log_short_fill_tx.signature],
        data: ['notUsed', abi.fix('250').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', 'notUsed', abi.fix('0.2')]
      }],
    },
    assertions: function(parsed) {
      assert.deepEqual(parsed, {
        cashFromTrade: '200',
        tradingFees: '0.06'
      });
    }
  });
});
