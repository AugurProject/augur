"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var proxyquire = require('proxyquire');
var clone = require("clone");
var errors = require("ethrpc").errors;
var eventsAPI = require("augur-contracts").api.events;
var functionsAPI = require("augur-contracts").api.functions;
var augur = new (require("../../../src"))();
var noop = require("../../../src/utils/noop");
var tools = require("../../tools");
var DEBUG = false;
// 38 tests total

describe("trade.checkGasLimit", function () {
  // 7 tests total
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
    "0x16": {id: "0x16", type: "sell", owner: "0xdeadbeef"},
    "0x17": {id: "0x16", type: "sell", owner: "0x42"}
  }
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      var checkGasLimit = proxyquire('../../../src/trading/check-gas-limit', {
        '../rpc-interface': {
          getCurrentBlock: function() {
            return { number: 1, gasLimit: t.gasLimit };
          }
        },
        '../api': function() {
          return {
          	Trades: {
          		get_trade: function (p, cb) {
                cb(mockTrades[p.id]);
              }
          	}
          };
        }
      });
      checkGasLimit(t.trade_ids, t.sender, function (err, trade_ids) {
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
  test({
    gasLimit: "0x47e7c4",
    sender: "0x42",
    trade_ids: ["0x88"],
    expected: {
      error: errors.TRADE_NOT_FOUND,
      trade_ids: undefined
    }
  });
  test({
    gasLimit: "0x47e7c4",
    sender: "0x42",
    trade_ids: ["0x17"],
    expected: {
      error: {error: "-5", message: errors.trade["-5"]},
      trade_ids: undefined
    }
  });
});

describe("trade.parseTradeReceipt", function () {
  // 6 tests total
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(require('../../../src/trading/take-order/parse-trade-receipt')(t.receipt));
    });
  };
  test({
    receipt: {},
    assertions: function (parsed) {
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
    assertions: function (parsed) {
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
        topics: [eventsAPI.log_fill_tx.signature],
        data: ['1', 'notUsed', abi.fix('10').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.03').toString(), 'notUsed', abi.fix('-5')]
      }],
    },
    assertions: function (parsed) {
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
        topics: [eventsAPI.log_fill_tx.signature],
        data: ['1', 'notUsed', abi.fix('10').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.03').toString(), 'notUsed', abi.fix('-5')]
      }, {
        topics: [eventsAPI.log_fill_tx.signature],
        data: ['1', 'notUsed', abi.fix('20').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.03').toString(), 'notUsed', abi.fix('-10')]
      }],
    },
    assertions: function (parsed) {
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
        topics: [eventsAPI.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('100').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.5')]
      }],
    },
    assertions: function (parsed) {
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
        topics: [eventsAPI.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('100').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.5')]
      },
      {
        topics: [eventsAPI.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('400').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.25')]
      },
      {
        topics: [eventsAPI.log_fill_tx.signature],
        data: ['2', 'notUsed', abi.fix('250').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', abi.fix('0.2')]
      }],
    },
    assertions: function (parsed) {
      assert.deepEqual(parsed, {
        sharesBought: '0',
        cashFromTrade: '200',
        tradingFees: '0.06'
      });
    }
  });
});

describe("trade.parseShortSellReceipt", function () {
  // 3 tests total
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(require('../../../src/trading/take-order/parse-short-sell-receipt')(t.receipt));
    });
  };
  test({
    receipt: {},
    assertions: function (parsed) {
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
    assertions: function (parsed) {
      assert.deepEqual(parsed, {
        cashFromTrade: '0',
        tradingFees: '0'
      });
    }
  });
  test({
    receipt: {
      logs: [{
        topics: [eventsAPI.log_short_fill_tx.signature],
        data: ['notUsed', abi.fix('100').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', 'notUsed', abi.fix('0.5')]
      },
      {
        topics: [eventsAPI.log_short_fill_tx.signature],
        data: ['notUsed', abi.fix('400').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', 'notUsed', abi.fix('0.25')]
      },
      {
        topics: [eventsAPI.log_short_fill_tx.signature],
        data: ['notUsed', abi.fix('250').toString(), 'notUsed', 'notUsed', 'notUsed', abi.fix('0.02').toString(), 'notUsed', 'notUsed', abi.fix('0.2')]
      }],
    },
    assertions: function (parsed) {
      assert.deepEqual(parsed, {
        cashFromTrade: '200',
        tradingFees: '0.06'
      });
    }
  });
});

describe("trade.trade", function () {
  // 11 tests total
  var finished;
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      finished = done;
      var trade = proxyquire('../../../src/trading/take-order/trade', {
        '../../rpc-interface': {
          waitForNextBlocks: t.waitForNextBlocks,
          getTransactionReceipt: t.receipt,
          handleRPCError: t.handleRPCError || noop
        },
        '../../api': function() {
          return { Trade: { trade: t.trade }, Trades: { commitTrade: t.commitTrade } };
        },
        '../check-gas-limit': t.checkGasLimit,
        './parse-trade-receipt': t.parseTradeReceipt,
      });
      trade(t.params);
    });
  };
  test({
    params:{
      max_value: '0.00001',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: undefined,
      onTradeHash: noop,
      onCommitSent: noop,
      onCommitSuccess: noop,
      onCommitFailed: noop,
      onNextBlock: noop,
      onTradeSent: noop,
      onTradeSuccess: noop,
      onTradeFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.isUndefined(sender)
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    makeTradeHash: noop,
    commitTrade: noop,
    waitForNextBlocks: noop,
    parseTradeReceipt: noop,
    trade: noop
  });
  test({
    params:{
      max_value: '0.00001',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: noop,
      onCommitSent: noop,
      onCommitSuccess: noop,
      onCommitFailed: noop,
      onNextBlock: noop,
      onTradeSent: noop,
      onTradeSuccess: noop,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {error: "-4", message: errors.trade["-4"]});
        finished();
      },
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    makeTradeHash: noop,
    commitTrade: noop,
    waitForNextBlocks: noop,
    parseTradeReceipt: noop,
    trade: noop
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: noop,
      onCommitSuccess: noop,
      onCommitFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
      onNextBlock: noop,
      onTradeSent: noop,
      onTradeSuccess: noop,
      onTradeFailed: noop,
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    waitForNextBlocks: noop,
    parseTradeReceipt: noop,
    trade: noop
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: noop,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: noop,
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      assert.deepEqual(p.onFailed, p.onTradeFailed);
      p.onSent();
      p.onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
          error: errors.TRADE_FAILED.error,
          message: errors.TRADE_FAILED.message + '-1',
          hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    handleRPCError: function(method, type, callReturn) {
      assert.deepEqual(method, 'trade');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, '-1');
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: noop,
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      assert.deepEqual(p.onFailed, p.onTradeFailed);
      p.onSent();
      p.onSuccess({ callReturn: '-1', hash: '0x123abc456def7890' });
    }
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
          error: errors.TRADE_FAILED.error,
          message: errors.TRADE_FAILED.message + '0',
          hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    handleRPCError: function(method, type, callReturn) {
      assert.deepEqual(method, 'trade');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, '0');
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: noop,
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSent();
      p.onSuccess({ callReturn: '0', hash: '0x123abc456def7890' });
    }
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, errors.TRANSACTION_RECEIPT_NOT_FOUND);
        finished();
      },
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: noop,
    receipt: function (txHash, cb) {
      cb(undefined);
    },
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSent();
      p.onSuccess({
      	callReturn: ['1', abi.fix('0'), abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: noop,
    receipt: function (txHash, cb) {
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSent();
      p.onSuccess({
      	callReturn: ['1', abi.fix('0'), abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: function (res) {
        assert.deepEqual(res, {
          hash: '0x123abc456def7890',
          unmatchedCash: '0',
          unmatchedShares: '0',
          sharesBought: '100',
          cashFromTrade: '-100.5',
          tradingFees: '0.5',
          gasFees: '0xabc123',
          timestamp: 1500000
        });
        finished();
      },
      onTradeFailed: undefined,
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function (receipt) {
      // just simplify this since we test parseTradeReceipt in it's own unit test.
      return receipt;
    },
    receipt: function (txHash, cb) {
      cb({
        sharesBought: '100',
        cashFromTrade: '-100.5',
        tradingFees: '0.5'
      });
    },
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSent();
      p.onSuccess({
      	callReturn: ['1', abi.fix('0'), abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
          error: errors.TRADE_FAILED.error,
          message: errors.TRADE_FAILED.message + '-1',
        	hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    handleRPCError: function(method, type, callReturn) {
      assert.deepEqual(method, 'trade');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, -1);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function (receipt) {},
    receipt: function (txHash, cb) {},
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSent();
      p.onSuccess({
      	callReturn: ['-1', abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    params:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function (hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
        	error: 711,
        	message: 'trade failed, instead of success value (1), received 0',
        	hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    handleRPCError: function(method, type, callReturn) {
      assert.deepEqual(method, 'trade');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, 0);
    },
    commitTrade: function (trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function (receipt) {},
    receipt: function (txHash, cb) {},
    trade: function (p) {
      assert.deepEqual(p.max_value, abi.fix('100', 'hex'));
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.trade_ids, ['0xa1', '0xa2', '0xa3']);
      assert.deepEqual(p.tradeGroupID, '0xe1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSent();
      p.onSuccess({
      	callReturn: [0, abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
});

describe("trade.short_sell", function () {
  // 11 tests total
  var finished;
  var test = function (t) {
    it(JSON.stringify(t), function (done) {
      finished = done;
      var short_sell = proxyquire('../../../src/trading/take-order/short-sell', {
        '../../rpc-interface': {
          waitForNextBlocks: t.waitForNextBlocks,
          getTransactionReceipt: t.receipt,
          handleRPCError: t.handleRPCError || noop
        },
        '../../api': function() {
          return { Trade: { short_sell: t.short_sell }, Trades: { commitTrade: t.commitTrade } };
        },
        '../check-gas-limit': t.checkGasLimit,
        './parse-short-sell-receipt': t.parseShortSellReceipt,
      });
      short_sell(t.params);
    });
  };
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: undefined,
      onTradeHash: noop,
      onCommitSent: noop,
      onCommitSuccess: noop,
      onCommitFailed: noop,
      onNextBlock: noop,
      onTradeSent: noop,
      onTradeSuccess: noop,
      onTradeFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(trade_ids, ['0xa1']);
      assert.isUndefined(sender);
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    commitTrade: noop,
    waitForNextBlocks: noop,
    parseShortSellReceipt: noop,
    short_sell: noop,
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: undefined,
      onCommitFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
      onNextBlock: undefined,
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: undefined
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    waitForNextBlocks: noop,
    parseShortSellReceipt: noop,
    short_sell: noop,
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: noop,
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: noop,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: noop,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: noop,
      onTradeSuccess: noop,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
    			error: 711,
    			message: 'trade failed, instead of success value (1), received 0',
    			hash: '0x123abc456def7890'
    		});
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    handleRPCError: function (method, type, callReturn) {
      assert.deepEqual(method, 'short_sell');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, 0);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: noop,
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
      	callReturn: 0,
        hash: '0x123abc456def7890'
      });
    },
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
        	error: errors.TRADE_FAILED.error,
          message: errors.TRADE_FAILED.message + '-1',
        	hash: '0x123abc456def7890'
        });
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    handleRPCError: function (method, type, callReturn) {
      assert.deepEqual(method, 'short_sell');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, '-1');
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: noop,
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
      	callReturn: '-1',
        hash: '0x123abc456def7890'
      });
    },
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
    			error: errors.TRADE_FAILED.error,
    			message: errors.TRADE_FAILED.message + '0',
    			hash: '0x123abc456def7890'
    		});
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    handleRPCError: function (method, type, callReturn) {
      assert.deepEqual(method, 'short_sell');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, 0);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: noop,
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
        callReturn: [0],
        hash: '0x123abc456def7890'
      });
    },
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
          error: errors.TRADE_FAILED.error,
          message: errors.TRADE_FAILED.message + '-1',
          hash: '0x123abc456def7890'
        });
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    handleRPCError: function (method, type, callReturn) {
      assert.deepEqual(method, 'short_sell');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, -1);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: noop,
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
        callReturn: ['-1'],
        hash: '0x123abc456def7890'
      });
    },
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {
          error: errors.TRADE_FAILED.error,
          message: errors.TRADE_FAILED.message + '1',
          hash: '0x123abc456def7890'
        });
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    handleRPCError: function (method, type, callReturn) {
      assert.deepEqual(method, 'short_sell');
      assert.deepEqual(type, 'number');
      assert.deepEqual(callReturn, 1);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: noop,
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
        callReturn: ['1', '0', '0'],
        hash: '0x123abc456def7890'
      });
    },
    receipt: noop
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, errors.TRANSACTION_RECEIPT_NOT_FOUND);
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: noop,
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
        callReturn: ['1', abi.fix('0'), abi.fix('100'), abi.fix('50')],
        hash: '0x123abc456def7890',
        gasFees: '0.0045',
        timestamp: 15000000
      });
    },
    receipt: function (txHash, cb) {
      assert.deepEqual(txHash, '0x123abc456def7890');
      cb(undefined);
    }
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function (err) {
        assert.deepEqual(err, {error: 999, message: 'Uh-Oh!'});
        finished();
      }
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function (receipt) {},
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
        callReturn: ['1', abi.fix('0'), abi.fix('100'), abi.fix('50')],
        hash: '0x123abc456def7890',
        gasFees: '0.0045',
        timestamp: 15000000
      });
    },
    receipt: function (txHash, cb) {
      assert.deepEqual(txHash, '0x123abc456def7890');
      cb({error: 999, message: 'Uh-Oh!'});
    }
  });
  test({
    params: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function (hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function (res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function (block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: function (res) {
        assert.deepEqual(res, {
          hash: '0x123abc456def7890',
          unmatchedShares: '0',
          matchedShares: '100',
          cashFromTrade: '49.5',
          price: '0.5',
          tradingFees: '0.5',
          gasFees: '0.0045',
          timestamp: 15000000
        });
        finished();
      },
      onTradeFailed: undefined
    },
    checkGasLimit: function (trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function (trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    waitForNextBlocks: function (forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function (receipt) {
      // simplified...
      return receipt;
    },
    short_sell: function (p) {
      assert.deepEqual(p.buyer_trade_id, '0xa1');
      assert.deepEqual(p.max_amount, abi.fix('100', 'hex'));
      assert.deepEqual(p.tradeGroupID, '0xabc1');
      assert.deepEqual(p.sender, '0x1');
      assert.isFunction(p.onSent);
      assert.isFunction(p.onFailed);
      assert.isFunction(p.onSuccess);
      p.onSuccess({
        callReturn: ['1', abi.fix('0'), abi.fix('100'), abi.fix('0.5')],
        hash: '0x123abc456def7890',
        gasFees: '0.0045',
        timestamp: 15000000
      });
    },
    receipt: function (txHash, cb) {
      assert.deepEqual(txHash, '0x123abc456def7890');
      cb({
        cashFromTrade: '49.5',
        tradingFees: '0.5'
      });
    }
  });
});
