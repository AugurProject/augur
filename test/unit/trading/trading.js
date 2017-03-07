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
    "0x16": {id: "0x16", type: "sell", owner: "0xdeadbeef"},
    "0x17": {id: "0x16", type: "sell", owner: "0x42"}
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

describe("trade.trade", function() {
  var checkGasLimit = augur.checkGasLimit;
  var commitTrade = augur.commitTrade;
  var fastforward = augur.rpc.fastforward;
  var parseTradeReceipt = augur.parseTradeReceipt;
  var transact = augur.transact;
  var receipt = augur.rpc.receipt;
  var finished;
  afterEach(function() {
    augur.checkGasLimit = checkGasLimit;
    augur.commitTrade = commitTrade;
    augur.rpc.fastforward = fastforward;
    augur.parseTradeReceipt = parseTradeReceipt;
    augur.transact = transact;
    augur.rpc.receipt = receipt;
  });
  var test = function(t) {
    it(JSON.stringify(t), function(done) {
      augur.checkGasLimit = t.checkGasLimit;
      augur.commitTrade = t.commitTrade;
      augur.rpc.fastforward = t.fastforward;
      augur.parseTradeReceipt = t.parseTradeReceipt;
      augur.transact = t.transact;
      augur.rpc.receipt = t.receipt;
      finished = done;

      augur.trade(t.max_value, t.max_amount, t.trade_ids, t.tradeGroupID, t.sender, t.onTradeHash, t.onCommitSent, t.onCommitSuccess, t.onCommitFailed, t.onNextBlock, t.onTradeSent, t.onTradeSuccess, t.onTradeFailed);
    });
  };
  test({
    max_value:{
      max_value: '0.00001',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: undefined,
      onTradeHash: undefined,
      onCommitSent: undefined,
      onCommitSuccess: undefined,
      onCommitFailed: undefined,
      onNextBlock: undefined,
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address(augur.from));
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    makeTradeHash: function() {},
    commitTrade: function() {},
    fastforward: function() {},
    parseTradeReceipt: function() {},
    transact: function() {}
  });
  test({
    max_value:{
      max_value: '0.00001',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: undefined,
      onCommitSent: undefined,
      onCommitSuccess: undefined,
      onCommitFailed: undefined,
      onNextBlock: undefined,
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {error: "-4", message: augur.errors.trade["-4"]});
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    makeTradeHash: function() {},
    commitTrade: function() {},
    fastforward: function() {},
    parseTradeReceipt: function() {},
    transact: function() {}
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: undefined,
      onCommitFailed: function(err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
      onNextBlock: undefined,
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: undefined,
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    fastforward: function() {},
    parseTradeReceipt: function() {},
    transact: function() {}
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
          error: {
            error: '-1', message: 'oracle only branch'
          },
          message: undefined,
          tx:
           { events: [ 'trade_logArrayReturn', 'log_fill_tx' ],
             gas: 787421,
             inputs: [ 'max_value', 'max_amount', 'trade_ids', 'tradeGroupID' ],
             label: 'Trade',
             method: 'trade',
             mutable: true,
             returns: 'hash[]',
             send: true,
             signature: [ 'int256', 'int256', 'int256[]', 'int256' ],
             to: augur.tx.Trade.trade.to,
             params: [ '0x56bc75e2d63100000', '0x56bc75e2d63100000', [ '0xa1', '0xa2', '0xa3' ], '0xe1' ] },
          hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onSuccess({ callReturn: '-1', hash: '0x123abc456def7890' });
    }
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
        	error: 711,
        	message: 'trade failed, instead of success value (1), received 0',
        	hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onSuccess({ callReturn: 0, hash: '0x123abc456def7890' });
    }
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, augur.errors.TRANSACTION_RECEIPT_NOT_FOUND);
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function() {},
    receipt: function(txHash, cb) {
      cb(undefined);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onSuccess({
      	callReturn: ['1', abi.fix('0'), abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function() {},
    receipt: function(txHash, cb) {
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onSuccess({
      	callReturn: ['1', abi.fix('0'), abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: function(res) {
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
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function(receipt) {
      // just simplify this since we test parseTradeReceipt in it's own unit test.
      return receipt;
    },
    receipt: function(txHash, cb) {
      cb({
        sharesBought: '100',
        cashFromTrade: '-100.5',
        tradingFees: '0.5'
      });
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onSuccess({
      	callReturn: ['1', abi.fix('0'), abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
        	error: {
        		error: '-1',
        		message: 'oracle only branch'
        	},
        	message: undefined,
        	tx: {
        		events: ['trade_logArrayReturn', 'log_fill_tx'],
        		gas: 787421,
        		inputs: ['max_value', 'max_amount', 'trade_ids', 'tradeGroupID'],
        		label: 'Trade',
        		method: 'trade',
        		mutable: true,
        		returns: 'hash[]',
        		send: true,
        		signature: ['int256', 'int256', 'int256[]', 'int256'],
        		to: augur.tx.Trade.trade.to,
        		params: ['0x56bc75e2d63100000', '0x56bc75e2d63100000', ['0xa1', '0xa2', '0xa3'], '0xe1']
        	},
        	hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function(receipt) {},
    receipt: function(txHash, cb) {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onSuccess({
      	callReturn: ['-1', abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
  test({
    max_value:{
      max_value: '100',
      max_amount: '100',
      trade_ids: ['0xa1', '0xa2', '0xa3'],
      tradeGroupID: '0xe1',
      sender: '0x1',
      onTradeHash: function(hash) { assert.deepEqual(hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0'); },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: utils.noop,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
        	error: 711,
        	message: 'trade failed, instead of success value (1), received 0',
        	hash: '0x123abc456def7890'
        });
        finished();
      },
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      cb(null, ['0xa1', '0xa2', '0xa3']);
    },
    commitTrade: function(trade) {
      assert.deepEqual(trade.hash, '0x55db664e568d4982f250e5f8fa2e731f93718999978c4bbfc1966de8655e3ca0');
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseTradeReceipt: function(receipt) {},
    receipt: function(txHash, cb) {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.trade.to);
      assert.deepEqual(tx.params, [
        '0x56bc75e2d63100000',
        '0x56bc75e2d63100000',
        [ '0xa1', '0xa2', '0xa3' ],
        '0xe1'
      ]);
      onSent();
      onSuccess({
      	callReturn: [0, abi.fix('0')],
      	hash: '0x123abc456def7890',
      	gasFees: '0xabc123',
      	timestamp: 1500000
      });
    }
  });
});

describe("trade.short_sell", function() {
  var checkGasLimit = augur.checkGasLimit;
  var commitTrade = augur.commitTrade;
  var fastforward = augur.rpc.fastforward;
  var parseShortSellReceipt = augur.parseShortSellReceipt;
  var transact = augur.transact;
  var receipt = augur.rpc.receipt;
  var finished;
  afterEach(function() {
    augur.checkGasLimit = checkGasLimit;
    augur.commitTrade = commitTrade;
    augur.rpc.fastforward = fastforward;
    augur.parseShortSellReceipt = parseShortSellReceipt;
    augur.transact = transact;
    augur.rpc.receipt = receipt;
  });
  var test = function(t) {
    it(JSON.stringify(t), function(done) {
      augur.checkGasLimit = t.checkGasLimit;
      augur.commitTrade = t.commitTrade;
      augur.rpc.fastforward = t.fastforward;
      augur.parseShortSellReceipt = t.parseShortSellReceipt;
      augur.transact = t.transact;
      augur.rpc.receipt = t.receipt;
      finished = done;

      augur.short_sell(t.buyer_trade_id, t.max_amount, t.tradeGroupID, t.sender, t.onTradeHash, t.onCommitSent, t.onCommitSuccess, t.onCommitFailed, t.onNextBlock, t.onTradeSent, t.onTradeSuccess, t.onTradeFailed);
    });
  };
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: undefined,
      onTradeHash: undefined,
      onCommitSent: undefined,
      onCommitSuccess: undefined,
      onCommitFailed: undefined,
      onNextBlock: undefined,
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address(augur.from));
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    commitTrade: function() {},
    fastforward: function() {},
    parseShortSellReceipt: function() {},
    transact: function() {},
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: undefined,
      onCommitFailed: function(err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      },
      onNextBlock: undefined,
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: undefined
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    fastforward: function() {},
    parseShortSellReceipt: function() {},
    transact: function() {},
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
    			error: 711,
    			message: 'trade failed, instead of success value (1), received 0',
    			hash: '0x123abc456def7890'
    		});
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
      	callReturn: 0,
        hash: '0x123abc456def7890'
      });
    },
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
        	error: {
        		error: '-1',
        		message: 'trade doesn\'t exist'
        	},
        	message: undefined,
        	tx: {
        		events: ['log_short_fill_tx', 'trade_logArrayReturn'],
        		gas: 1059796,
        		inputs: ['buyer_trade_id', 'max_amount', 'tradeGroupID'],
        		label: 'Short sell',
        		method: 'short_sell',
        		mutable: true,
        		returns: 'hash[]',
        		send: true,
        		signature: ['int256', 'int256', 'int256'],
        		to: augur.tx.Trade.short_sell.to,
        		params: ['0xa1', '0x56bc75e2d63100000', '0xabc1']
        	},
        	hash: '0x123abc456def7890'
        });
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
      	callReturn: '-1',
        hash: '0x123abc456def7890'
      });
    },
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
    			error: 711,
    			message: 'trade failed, instead of success value (1), received 0',
    			hash: '0x123abc456def7890'
    		});
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
        callReturn: [0],
        hash: '0x123abc456def7890'
      });
    },
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
          error: {
            error: '-1',
            message: 'trade doesn\'t exist'
          },
          message: undefined,
          tx: {
            events: ['log_short_fill_tx', 'trade_logArrayReturn'],
            gas: 1059796,
            inputs: ['buyer_trade_id', 'max_amount', 'tradeGroupID'],
            label: 'Short sell',
            method: 'short_sell',
            mutable: true,
            returns: 'hash[]',
            send: true,
            signature: ['int256', 'int256', 'int256'],
            to: augur.tx.Trade.short_sell.to,
            params: ['0xa1', '0x56bc75e2d63100000', '0xabc1']
          },
          hash: '0x123abc456def7890'
        });
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
        callReturn: ['-1'],
        hash: '0x123abc456def7890'
      });
    },
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {
          error: 1,
          message: undefined,
          tx: {
            events: ['log_short_fill_tx', 'trade_logArrayReturn'],
            gas: 1059796,
            inputs: ['buyer_trade_id', 'max_amount', 'tradeGroupID'],
            label: 'Short sell',
            method: 'short_sell',
            mutable: true,
            returns: 'hash[]',
            send: true,
            signature: ['int256', 'int256', 'int256'],
            to: augur.tx.Trade.short_sell.to,
            params: ['0xa1', '0x56bc75e2d63100000', '0xabc1']
          },
          hash: '0x123abc456def7890'
        });
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
        callReturn: ['1', '0', '0'],
        hash: '0x123abc456def7890'
      });
    },
    receipt: function() {}
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, augur.errors.TRANSACTION_RECEIPT_NOT_FOUND);
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function() {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
        callReturn: ['1', abi.fix('0'), abi.fix('100'), abi.fix('50')],
        hash: '0x123abc456def7890',
        gasFees: '0.0045',
        timestamp: 15000000
      });
    },
    receipt: function(txHash, cb) {
      assert.deepEqual(txHash, '0x123abc456def7890');
      cb(undefined);
    }
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: undefined,
      onTradeFailed: function(err) {
        assert.deepEqual(err, {error: 999, message: 'Uh-Oh!'});
        finished();
      }
    },
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function(receipt) {},
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
        callReturn: ['1', abi.fix('0'), abi.fix('100'), abi.fix('50')],
        hash: '0x123abc456def7890',
        gasFees: '0.0045',
        timestamp: 15000000
      });
    },
    receipt: function(txHash, cb) {
      assert.deepEqual(txHash, '0x123abc456def7890');
      cb({error: 999, message: 'Uh-Oh!'});
    }
  });
  test({
    buyer_trade_id: {
      buyer_trade_id: '0xa1',
      max_amount: '100',
      tradeGroupID: '0xabc1',
      sender: '0x1',
      onTradeHash: function(hash) {
        assert.deepEqual(hash, '0x10acace6664b0aab78b8ae82735879cd4d7517f31d41af71e90a0cb3a948b09b');
      },
      onCommitSent: undefined,
      onCommitSuccess: function(res) {
        assert.deepEqual(res, { callReturn: '1' });
      },
      onCommitFailed: undefined,
      onNextBlock: function(block) {
        assert.deepEqual(block, '0xb1');
      },
      onTradeSent: undefined,
      onTradeSuccess: function(res) {
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
    checkGasLimit: function(trade_ids, sender, cb) {
      assert.deepEqual(sender, abi.format_address('0x1'));
      cb(null, trade_ids);
    },
    commitTrade: function(trade) {
      trade.onSent();
      trade.onSuccess({ callReturn: '1' });
    },
    fastforward: function(forward, cb) {
      cb('0xb1');
    },
    parseShortSellReceipt: function(receipt) {
      // simplified...
      return receipt;
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.tx.Trade.short_sell.to);
      assert.deepEqual(tx.params, [ '0xa1', '0x56bc75e2d63100000', '0xabc1' ]);
      onSuccess({
        callReturn: ['1', abi.fix('0'), abi.fix('100'), abi.fix('0.5')],
        hash: '0x123abc456def7890',
        gasFees: '0.0045',
        timestamp: 15000000
      });
    },
    receipt: function(txHash, cb) {
      assert.deepEqual(txHash, '0x123abc456def7890');
      cb({
        cashFromTrade: '49.5',
        tradingFees: '0.5'
      });
    }
  });
});
