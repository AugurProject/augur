"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var noop = require("../../../src/utils/noop");
var isFunction = require("../../../src/utils/is-function");
var augur = new (require("../../../src"))();

describe("logs.parseCompleteSetsLogs", function () {
  // 6 tests total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.parseCompleteSetsLogs(t.logs, t.mergeInto));
    });
  };
  test({
    description: 'Should handle one log in the logs argument array without passing a mergeInto argument.',
    logs: [{
      data: [ abi.fix('100'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    }],
    mergeInto: undefined,
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x00c1': [{
          amount: '100',
          blockNumber: 65793,
          numOutcomes: 2,
          type: 'buy'
        }]
      });
    }
  });
  test({
    description: 'Should handle multiple logs in the logs argument array without passing a mergeInto argument.',
    logs: [{
      data: [ abi.fix('100'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('43'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('985.23'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    }],
    mergeInto: undefined,
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x00c1': [{
          amount: '100',
          blockNumber: 65793,
          numOutcomes: 2,
          type: 'buy'
        },{
          amount: '43',
          blockNumber: 65793,
          numOutcomes: 2,
          type: 'buy'
        },{
          amount: '985.23',
          blockNumber: 65793,
          numOutcomes: 2,
          type: 'buy'
        }],
      });
    }
  });
  test({
    description: 'Should handle multiple logs in the logs argument array without passing a mergeInto argument and given multiple markets.',
    logs: [{
      data: [ abi.fix('100'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('43'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('985.23'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    },
    {
      data: "0x",
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('3245.22'), '5' ],
      topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
      blockNumber: '010101'
    },
    {
      data: "0x",
      topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('940'), '5' ],
      topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('15.0203'), '5' ],
      topics: ['0x00a1', '0x00b1', '0x00c2', '2'],
      blockNumber: '010101'
    }],
    mergeInto: undefined,
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x00c1': [{
          amount: '100',
          blockNumber: 65793,
          numOutcomes: 2,
          type: 'buy'
        },{
          amount: '43',
          blockNumber: 65793,
          numOutcomes: 2,
          type: 'buy'
        },{
          amount: '985.23',
          blockNumber: 65793,
          numOutcomes: 2,
          type: 'buy'
        }],
        '0x00c2': [{
          amount: '3245.22',
          blockNumber: 65793,
          numOutcomes: 5,
          type: 'sell'
        },{
          amount: '940',
          blockNumber: 65793,
          numOutcomes: 5,
          type: 'sell'
        },{
          amount: '15.0203',
          blockNumber: 65793,
          numOutcomes: 5,
          type: 'sell'
        }],
      });
    }
  });
  test({
    description: 'Should handle one log in the logs argument array while also passing a mergeInto argument.',
    logs: [{
      data: [ abi.fix('100'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    }],
    mergeInto: {
      '0x00c1': [{
        amount: '5',
        blockNumber: 65793,
        numOutcomes: 2,
        type: 'buy'
      }]
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x00c1': [
          {
            amount: '5',
            blockNumber: 65793,
            numOutcomes: 2,
            type: 'buy'
          },
          [{
            amount: '100',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.5',
            type: 'buy'
          }],
          [{
            amount: '100',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.5',
            type: 'buy'
          }]
        ]
      });
    }
  });
  test({
    description: 'Should handle multiple logs in the logs argument array while also passing a mergeInto argument.',
    logs: [{
      data: [ abi.fix('100'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    },
    {
      data: [ abi.fix('234'), '4' ],
      topics: ['0x00a2', '0x00b2', '0x00c2', '2'],
      blockNumber: '010101'
    }],
    mergeInto: {
      '0x00c1': [{
        amount: '50',
        blockNumber: 65793,
        numOutcomes: 2,
        type: 'buy'
      }],
      '0x00c2': [{
        amount: '120',
        blockNumber: 65793,
        numOutcomes: 4,
        type: 'sell'
      }]
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x00c1': [
          {
            amount: '50',
            blockNumber: 65793,
            numOutcomes: 2,
            type: 'buy'
          },
          [{
            amount: '100',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.5',
            type: 'buy'
          }],
          [{
            amount: '100',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.5',
            type: 'buy'
          }]
        ],
        '0x00c2': [
          {
            amount: '120',
            blockNumber: 65793,
            numOutcomes: 4,
            type: 'sell'
          },
          [{
            amount: '234',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.25',
            type: 'sell'
          }],
          [{
            amount: '234',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.25',
            type: 'sell'
          }],
          [{
            amount: '234',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.25',
            type: 'sell'
          }],
          [{
            amount: '234',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.25',
            type: 'sell'
          }]
        ]
      });
    }
  });
  test({
    description: 'Should handle one log in the logs argument array and passing a mergeInto argument.',
    logs: [{
      data: [ abi.fix('100'), '2' ],
      topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
      blockNumber: '010101'
    }],
    mergeInto: {},
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x00c1': {
          "1": [{
            amount: '100',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.5',
            type: 'buy'
          }],
          "2": [{
            amount: '100',
            blockNumber: 65793,
            isCompleteSet: true,
            price: '0.5',
            type: 'buy'
          }]
        }
      });
    }
  });
});

/***********
 * Getters *
***********/
describe("logs.getMarketPriceHistory", function () {
  // 3 tests total
  var test = function (t) {
    describe(t.description, function () {
      var getLogs = augur.getLogs;
      after(function () {
        augur.getLogs = getLogs;
      });
      it("sync", function () {
        augur.getLogs = function (label, filterParams, aux, callback) {
          if (!callback && isFunction(filterParams)) {
            callback = filterParams;
            filterParams = null;
          }
          aux.mergedLogs = filterParams;
          if (!callback) return aux;
          callback(null, aux);
        };
        try {
          t.assertions(null, augur.getMarketPriceHistory(t.market, t.options));
          if (!t.options) t.assertions(null, augur.getMarketPriceHistory(t.market));
        } catch (exc) {
          t.assertions(exc);
        }
      });
      it("async", function (done) {
        augur.getLogs = function (label, filterParams, aux, callback) {
          if (!callback && isFunction(filterParams)) {
            callback = filterParams;
            filterParams = null;
          }
          aux.mergedLogs = filterParams;
          if (!callback) return aux;
          callback(null, aux);
        };
        augur.getMarketPriceHistory(t.market, t.options, function (err, priceHistory) {
          t.assertions(err, priceHistory);
          if (t.options) return done();
          augur.getMarketPriceHistory(t.market, function (err, priceHistory) {
            t.assertions(err, priceHistory);
            done();
          });
        });
      });
    });
  };

  test({
    description: 'Should pass the market merged with the options arg to getLogs',
    market: '0x00a1',
    options: { test: 'hello world', fromBlock: '0x2' },
    callback: noop,
    assertions: function (err, o) {
      assert.isNull(err);
      assert.deepEqual(o, { test: 'hello world', market: '0x00a1', fromBlock: '0x2' });
    }
  });

  test({
    description: 'Should pass the market as the params if options is undefined',
    market: '0x00a1',
    options: undefined,
    assertions: function (err, o) {
      assert.isNull(err);
      assert.deepEqual(o, { market: '0x00a1' });
    }
  });

  test({
    description: 'Should be able to be passed just market and cb and still handle the request',
    market: '0x00a1',
    assertions: function (err, o) {
      assert.isNull(err);
      assert.deepEqual(o, { market: '0x00a1' });
    }
  });
});
describe("logs.sortByBlockNumber", function () {
  // 4 tests total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.sortByBlockNumber(t.a, t.b));
    });
  };

  test({
    description: 'should sort 2 numbers sent as Strings',
    a: { blockNumber: '3' },
    b: { blockNumber: '2' },
    assertions: function (o) {
      assert.equal(o, '1');
    }
  });

  test({
    description: 'should sort 2 numbers sent as JS Numbers',
    a: { blockNumber: 50 },
    b: { blockNumber: 3 },
    assertions: function (o) {
      assert.equal(o, 47);
    }
  });

  test({
    description: 'should sort 2 numbers sent as Hex Strings',
    a: { blockNumber: '0x01' },
    b: { blockNumber: '0x05' },
    assertions: function (o) {
      assert.equal(o, -4);
    }
  });

  test({
    description: 'should sort 2 numbers sent as Big Numbers',
    a: { blockNumber: abi.bignum('25') },
    b: { blockNumber: abi.bignum('3') },
    assertions: function (o) {
      assert.equal(o, 22);
    }
  });
});
describe("logs.buildTopicsList", function () {
  // 3 tests total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.buildTopicsList(t.event, t.params));
    });
  };

  test({
    description: 'should handle an event with a single input',
    event: { signature: augur.store.getState().contractsAPI.events.completeSets_logReturn.signature, inputs: [{ name: 'amount', indexed: true }]},
    params: { amount: '50' },
    assertions: function (o) {
      assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6' , '0x0000000000000000000000000000000000000000000000000000000000000050']);
    }
  });

  test({
    description: 'should handle an event with a multiple inputs, some indexed some not',
    event: { signature: augur.store.getState().contractsAPI.events.completeSets_logReturn.signature, inputs: [{ name: 'amount', indexed: true }, { name: 'unindexed', indexed: false }, { name: 'shares', indexed: true } ]},
    params: { amount: '50', unindexed: 'this shouldnt be in the topics array out', shares: '10' },
    assertions: function (o) {
      assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6' , '0x0000000000000000000000000000000000000000000000000000000000000050',
      '0x0000000000000000000000000000000000000000000000000000000000000010']);
    }
  });

  test({
    description: 'should handle an event with no inputs',
    event: { signature: augur.store.getState().contractsAPI.events.completeSets_logReturn.signature, inputs: []},
    params: {},
    assertions: function (o) {
      assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6']);
    }
  });
});
describe("logs.parametrizeFilter", function () {
  // 2 tests total
  var test = function (t) {
    var block = augur.rpc.block;
    it(t.description, function () {
      augur.rpc.block = { number: t.state.blockNumber };
      t.assertions(augur.parametrizeFilter(t.event, t.params));
      augur.rpc.block = block;
    });
  };

  test({
    description: 'should return a prepared filter object',
    event: { signature: augur.store.getState().contractsAPI.events.completeSets_logReturn.signature, inputs: [ { name: 'amount', indexed: true }, { name: 'market', indexed: true }, { name: 'numOutcomes', indexed: true } ], contract: 'CompleteSets'},
    params: { amount: '50', market: '0x0a1', numOutcomes: '2' },
    state: { blockNumber: 100 },
    assertions: function (o) {
      assert.deepEqual(o, {
        fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
        toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
        address: augur.contracts.CompleteSets,
        topics: [augur.api.events.completeSets_logReturn.signature, '0x0000000000000000000000000000000000000000000000000000000000000050', '0x00000000000000000000000000000000000000000000000000000000000000a1',
        '0x0000000000000000000000000000000000000000000000000000000000000002']
      });
    }
  });

  test({
    description: 'should return a prepared filter object when given to/from blocks',
    event: { signature: augur.store.getState().contractsAPI.events.completeSets_logReturn.signature, inputs: [ { name: 'amount', indexed: true }, { name: 'market', indexed: true }, { name: 'numOutcomes', indexed: true } ], contract: 'CompleteSets'},
    params: { amount: '50', market: '0x0a1', numOutcomes: '2', toBlock: '0x0b2', fromBlock: '0x0b1' },
    state: { blockNumber: 100 },
    assertions: function (o) {
      assert.deepEqual(o, {
        fromBlock: '0x0b1',
        toBlock: '0x0b2',
        address: augur.contracts.CompleteSets,
        topics: [augur.api.events.completeSets_logReturn.signature, '0x0000000000000000000000000000000000000000000000000000000000000050', '0x00000000000000000000000000000000000000000000000000000000000000a1',
        '0x0000000000000000000000000000000000000000000000000000000000000002']
      });
    }
  });
});
describe("logs.insertIndexedLog", function () {
  // 5 tests total
  var processedLogs;
  var test = function (t) {
    it(t.description, function () {
      processedLogs = t.processedLogs;
      t.assertions(augur.insertIndexedLog(t.processedLogs, t.parsed, t.index));
    });
  };

  test({
    description: 'Should insert an indexed log, passed as an array, into the processedLogs passed in',
    processedLogs: {'0x00c1': []},
    parsed: {
      market: '0x00c1',
      value: '0x000abc123',
    },
    index: ['market'],
    assertions: function (o) {
      assert.deepEqual(processedLogs, { '0x00c1': [ { market: '0x00c1', value: '0x000abc123' } ] });
    }
  });

  test({
    description: 'Should insert an indexed log, passed as an array, into the processedLogs passed in as an empty object',
    processedLogs: {},
    parsed: {
      market: '0x000abc123',
    },
    index: ['market'],
    assertions: function (o) {
      assert.deepEqual(processedLogs, { '0x000abc123': [ { 'market': '0x000abc123' } ] });
    }
  });

  test({
    description: 'Should insert an indexed log, where indexed is a string, into the processedLogs passed in as an empty object',
    processedLogs: {},
    parsed: {
      market: '0x000abc123',
    },
    index: 'market',
    assertions: function (o) {
      assert.deepEqual(processedLogs, { '0x000abc123': [ { 'market': '0x000abc123' } ] });
    }
  });

  test({
    description: 'Should insert an indexed log, where indexed is an array of length 2, into the processedLogs passed in as an empty object',
    processedLogs: {},
    parsed: {
      '0x00c1': '0x0000000000000000000000000000000000000000000000000000000000000002',
      '0x00a1': '0x0000000000000000000000000000000000000000000000000000000000000001'
    },
    index: ['0x00c1', '0x00a1'],
    assertions: function (o) {
      assert.deepEqual(processedLogs, {
        '0x0000000000000000000000000000000000000000000000000000000000000002': {
          '0x0000000000000000000000000000000000000000000000000000000000000001': [{
            '0x00a1': '0x0000000000000000000000000000000000000000000000000000000000000001',
            '0x00c1': '0x0000000000000000000000000000000000000000000000000000000000000002'
          }]
        }
      });
    }
  });

  test({
    description: 'Should insert an indexed log, where indexed is an array of length 2, into the processedLogs passed in',
    processedLogs: { '0x00c1': { '0x00a1': [] }},
    parsed: {
      market: '0x00c1',
      value: '0x00a1'
    },
    index: ['market', 'value'],
    assertions: function (o) {
      assert.deepEqual(processedLogs, {
        '0x00c1': {
          '0x00a1': [{
            value: '0x00a1',
            market: '0x00c1'
          }],
        }
      });
    }
  });
});
describe("logs.processLogs", function () {
  // 6 total tests
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.processLogs(t.label, t.index, t.logs, t.extraField, t.processedLogs));
    });
  };

  test({
    description: 'should handle no index, processedLogs, or extraField passed in, with only 1 log to parse.',
    label: 'log_add_tx',
    index: undefined,
    logs: [{
      topics: [null, '0x0b1', '0x0a1'],
      data: ['1', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: false
    }],
    extraField: undefined,
    processedLogs: undefined,
    assertions: function (o) {
      assert.deepEqual(o, [{
        market: '0x0b1',
        sender: '0x00000000000000000000000000000000000000a1',
        type: 'buy',
        price: '100',
        amount: '10',
        outcome: 1,
        tradeid: '0x0abc1',
        tradeGroupID: 0,
        isShortAsk: true,
        timestamp: 5637144576,
        blockNumber: 65793,
        transactionHash: '0x0c1',
        removed: false
      }]);
    }
  });

  test({
    description: 'should handle no index or processedLogs passed in, with 2 logs to parse with an extraField to add',
    label: 'log_add_tx',
    index: undefined,
    logs: [{
      topics: [null, '0x0b1', '0x0a1'],
      data: ['1', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: false
    },
    {
      topics: [null, '0x0d1', '0x0a1'],
      data: ['2', '125000000000000000000', '15000000000000000000', '1', '0x0abc2', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: false
    }],
    extraField: { name: 'type', value: 'buy'},
    processedLogs: undefined,
    assertions: function (o) {
      // we should have 2 processedLogs back, the 2nd should have it's type changed to buy because of the extraField modification despite it being passed as a sell.
      assert.deepEqual(o, [{
        market: '0x0b1',
        sender: '0x00000000000000000000000000000000000000a1',
        type: 'buy',
        price: '100',
        amount: '10',
        outcome: 1,
        tradeid: '0x0abc1',
        tradeGroupID: 0,
        isShortAsk: true,
        timestamp: 5637144576,
        blockNumber: 65793,
        transactionHash: '0x0c1',
        removed: false
      },
      {
        market: '0x0d1',
        sender: '0x00000000000000000000000000000000000000a1',
        type: 'buy',
        price: '125',
        amount: '15',
        outcome: 1,
        tradeid: '0x0abc2',
        tradeGroupID: 0,
        isShortAsk: true,
        timestamp: 5637144576,
        blockNumber: 65793,
        transactionHash: '0x0c1',
        removed: false
      }]);
    }
  });

  test({
    description: 'should handle an index String but no processedLogs passed in, with 2 logs to parse with an extraField to add and one of the logs is to be removed',
    label: 'log_add_tx',
    index: 'market',
    logs: [{
      topics: [null, '0x0b1', '0x0a1'],
      data: ['1', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: false
    },
    {
      topics: [null, '0x0d1', '0x0a1'],
      data: ['2', '125000000000000000000', '15000000000000000000', '1', '0x0abc2', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: true
    }],
    extraField: { name: 'type', value: 'buy'},
    processedLogs: undefined,
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x0b1': [{
          market: '0x0b1',
          sender: '0x00000000000000000000000000000000000000a1',
          type: 'buy',
          price: '100',
          amount: '10',
          outcome: 1,
          tradeid: '0x0abc1',
          tradeGroupID: 0,
          isShortAsk: true,
          timestamp: 5637144576,
          blockNumber: 65793,
          transactionHash: '0x0c1',
          removed: false
        }]
      });
    }
  });

  test({
    description: 'should handle an index Array but no processedLogs passed in, with 1 log passed in, no extraField.',
    label: 'log_add_tx',
    index: ['market'],
    logs: [{
      topics: [null, '0x0b1', '0x0a1'],
      data: ['2', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: false
    }],
    extraField: undefined,
    processedLogs: undefined,
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x0b1': [{
          market: '0x0b1',
          sender: '0x00000000000000000000000000000000000000a1',
          type: 'sell',
          price: '100',
          amount: '10',
          outcome: 1,
          tradeid: '0x0abc1',
          tradeGroupID: 0,
          isShortAsk: true,
          timestamp: 5637144576,
          blockNumber: 65793,
          transactionHash: '0x0c1',
          removed: false
        }]
      });
    }
  });

  test({
    description: 'should handle an index Array and processedLogs passed in, with 1 log passed in, no extraField.',
    label: 'log_add_tx',
    index: ['market'],
    logs: [{
      topics: [null, '0x0b1', '0x0a1'],
      data: ['2', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: false
    }],
    extraField: undefined,
    processedLogs: {'0x0b1': [{ name: 'test', value: 'example'}]},
    assertions: function (o) {
      // in this case we simply add an example object in the processedLogs to prove that it adds to an existing array.
      assert.deepEqual(o, {
        '0x0b1': [{ name: 'test', value: 'example'}, {
          market: '0x0b1',
          sender: '0x00000000000000000000000000000000000000a1',
          type: 'sell',
          price: '100',
          amount: '10',
          outcome: 1,
          tradeid: '0x0abc1',
          tradeGroupID: 0,
          isShortAsk: true,
          timestamp: 5637144576,
          blockNumber: 65793,
          transactionHash: '0x0c1',
          removed: false
        }]
      });
    }
  });

  test({
    description: 'should handle an index Array of length 2 and processedLogs passed in, with 2 log passed in, no extraField.',
    label: 'log_add_tx',
    index: ['type', 'market'],
    logs: [{
      topics: [null, '0x0b1', '0x0a1'],
      data: ['2', '100000000000000000000', '10000000000000000000', '1', '0x0abc1', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c1',
      removed: false
    },
    {
      topics: [null, '0x0b1', '0x0a1'],
      data: ['1', '10000000000000000000', '1000000000000000000', '1', '0x0abc1', false, 150000000, 0],
      blockNumber: '010101',
      transactionHash: '0x0c2',
      removed: false
    }],
    extraField: undefined,
    processedLogs: {'sell': {'0x0b1': []}, 'buy': {'0x0b1': []},},
    assertions: function (o) {
      assert.deepEqual(o, {
        'buy': {
          '0x0b1': [{
            market: '0x0b1',
            sender: '0x00000000000000000000000000000000000000a1',
            type: 'buy',
            price: '10',
            amount: '1',
            outcome: 1,
            tradeid: '0x0abc1',
            tradeGroupID: 0,
            isShortAsk: true,
            timestamp: 5637144576,
            blockNumber: 65793,
            transactionHash: '0x0c2',
            removed: false
          }],
        },
        'sell': {
          '0x0b1': [{
            market: '0x0b1',
            sender: '0x00000000000000000000000000000000000000a1',
            type: 'sell',
            price: '100',
            amount: '10',
            outcome: 1,
            tradeid: '0x0abc1',
            tradeGroupID: 0,
            isShortAsk: true,
            timestamp: 5637144576,
            blockNumber: 65793,
            transactionHash: '0x0c1',
            removed: false
          }],
        }
      });
    }
  });
});
describe("logs.getFilteredLogs", function () {
  // 6 total tests
  var test = function (t) {
    var block = augur.rpc.block;
    it(t.description, function () {
      var getLogs = augur.rpc.getLogs;
      augur.rpc.getLogs = t.getLogs;
      augur.rpc.block = { number: t.state.blockNumber };
      t.assertions(augur.getFilteredLogs(t.label, t.filterParams, t.callback));
      augur.rpc.getLogs = getLogs;
      augur.rpc.block = block;
    });
  };
  test({
    description: 'Should handle undefined filterParams and cb',
    label: 'log_add_tx',
    filterParams: undefined,
    callback: undefined,
    state: { blockNumber: 100 },
    getLogs: function (filters) {
      // simply pass back filters to be tested by assertions
      return filters;
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        fromBlock: '0x1',
        toBlock: 'latest',
        address: augur.store.getState().contractsAPI.events['log_add_tx'].address,
        topics: [augur.store.getState().contractsAPI.events['log_add_tx'].signature,
          null,
          null
        ]
      });
    }
  });
  test({
    description: 'Should handle passed filterParams and undefined cb',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    state: { blockNumber: 100 },
    callback: undefined,
    getLogs: function (filters) {
      // simply pass back filters to be tested by assertions
      return filters;
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        fromBlock: '0x0b1',
        toBlock: '0x0b2',
        address: augur.store.getState().contractsAPI.events['log_add_tx'].address,
        topics: [augur.store.getState().contractsAPI.events['log_add_tx'].signature,
          null,
          null
        ]
      });
    }
  });
  test({
    description: 'Should handle passed filterParams and cb',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    state: { blockNumber: 100 },
    callback: function (err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs[0], {
        fromBlock: '0x0b1',
        toBlock: '0x0b2',
        address: augur.store.getState().contractsAPI.events['log_add_tx'].address,
        topics: [augur.store.getState().contractsAPI.events['log_add_tx'].signature,
          null,
          null
        ]
      });
    },
    getLogs: function (filters, cb) {
      // simply pass back filters to be tested by cb assertions
      cb([filters]);
    },
    assertions: function (o) {}
  });
  test({
    description: 'Should handle passed filterParams and cb when getLogs returns an error object',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    state: { blockNumber: 100 },
    callback: function (err, logs) {
      assert.isNull(logs);
      assert.deepEqual(err, {
        error: 'this is a problem!'
      });
    },
    getLogs: function (filters, cb) {
      // simply pass back filters to be tested by cb assertions
      cb({ error: 'this is a problem!' });
    },
    assertions: function (o) {}
  });
  test({
    description: 'Should handle passed filterParams and cb when getLogs returns an empty array',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    state: { blockNumber: 100 },
    callback: function (err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, []);
    },
    getLogs: function (filters, cb) {
      // simply pass back an empty array to be tested by cb assertions
      cb([]);
    },
    assertions: function (o) {}
  });
  test({
    description: 'Should handle passed filterParams as a callback',
    label: 'log_add_tx',
    filterParams: function (err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, []);
    },
    state: { blockNumber: 100 },
    callback: undefined,
    getLogs: function (filters, cb) {
      // simply pass back undefined to be tested by cb assertions
      cb(undefined);
    },
    assertions: function (o) {}
  });
});
describe("logs.chunkBlocks", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.chunkBlocks(t.params.fromBlock, t.params.toBlock));
    });
  };
  test({
    description: "[500, 1000]",
    params: {
      fromBlock: 500,
      toBlock: 1000
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 500, toBlock: 1000}
      ]);
    }
  });
  test({
    description: "[400, 1000]",
    params: {
      fromBlock: 400,
      toBlock: 1000
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 500, toBlock: 1000},
        {fromBlock: 400, toBlock: 499}
      ]);
    }
  });
  test({
    description: "[400, 1500]",
    params: {
      fromBlock: 400,
      toBlock: 1500
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 1000, toBlock: 1500},
        {fromBlock: 500, toBlock: 999},
        {fromBlock: 400, toBlock: 499}
      ]);
    }
  });
  test({
    description: "[400, 1400]",
    params: {
      fromBlock: 400,
      toBlock: 1400
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 900, toBlock: 1400},
        {fromBlock: 400, toBlock: 899}
      ]);
    }
  });
  test({
    description: "[399, 1400]",
    params: {
      fromBlock: 399,
      toBlock: 1400
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 900, toBlock: 1400},
        {fromBlock: 400, toBlock: 899},
        {fromBlock: 399, toBlock: 399}
      ]);
    }
  });
  test({
    description: "[0, 1400]",
    params: {
      fromBlock: 0,
      toBlock: 1400
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 900, toBlock: 1400},
        {fromBlock: 400, toBlock: 899},
        {fromBlock: 1, toBlock: 399}
      ]);
    }
  });
  test({
    description: "[-5, 1400]",
    params: {
      fromBlock: -5,
      toBlock: 1400
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 900, toBlock: 1400},
        {fromBlock: 400, toBlock: 899},
        {fromBlock: 1, toBlock: 399}
      ]);
    }
  });
  test({
    description: "[100, 99]",
    params: {
      fromBlock: 100,
      toBlock: 99
    },
    assertions: function (output) {
      assert.deepEqual(output, []);
    }
  });
  test({
    description: "[100, 100]",
    params: {
      fromBlock: 100,
      toBlock: 100
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 100, toBlock: 100}
      ]);
    }
  });
  test({
    description: "[100, 100]",
    params: {
      fromBlock: 100,
      toBlock: 100
    },
    assertions: function (output) {
      assert.deepEqual(output, [
        {fromBlock: 100, toBlock: 100}
      ]);
    }
  });
});
describe("logs.getLogsChunked", function () {
  var getLogs = augur.getLogs;
  var block = augur.rpc.block;
  var finished;
  afterEach(function () {
    augur.getLogs = getLogs;
    augur.rpc.block = block;
    finished = undefined;
  });
  var test = function (t) {
    it(t.description, function (done) {
      augur.getLogs = t.getLogs;
      augur.rpc.block = t.block || block;
      finished = done;

      augur.getLogsChunked(t.params.label, t.params.filterParams, t.params.aux, function (logsChunk) {
        t.assertions(logsChunk);
      }, t.callback || done);
    });
  };
  test({
    description: "Error from getLogs",
    params: {
      label: "marketCreated",
      filterParams: {
        fromBlock: 500,
        toBlock: 1000
      },
      aux: null
    },
    getLogs: function (label, filterParams, aux, callback) {
      callback({ error: 999, message: 'Uh-Oh!' });
    },
    assertions: function (logsChunk) {
      // doesn't get called in this case
      assert.isTrue(false);
    },
    callback: function (err) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      finished();
    }
  });
  test({
    description: "marketCreated on without passing filterParams",
    params: {
      label: "marketCreated",
      filterParams: undefined,
      aux: null
    },
    block: { number: 500 },
    getLogs: function (label, filterParams, aux, callback) {
      var params = {label: label, filterParams: filterParams, aux: aux};
      if (!callback) return params;
      callback(null, params);
    },
    assertions: function (logsChunk) {
      assert.strictEqual(logsChunk.label, "marketCreated");
      assert.strictEqual(logsChunk.filterParams.fromBlock, 1);
      assert.strictEqual(logsChunk.filterParams.toBlock, 500);
      assert.deepEqual(logsChunk.aux, {});
    }
  });
  test({
    description: "marketCreated on [500, 1000]",
    params: {
      label: "marketCreated",
      filterParams: {
        fromBlock: 500,
        toBlock: 1000
      },
      aux: null
    },
    getLogs: function (label, filterParams, aux, callback) {
      var params = {label: label, filterParams: filterParams, aux: aux};
      if (!callback) return params;
      callback(null, params);
    },
    assertions: function (logsChunk) {
      assert.strictEqual(logsChunk.label, "marketCreated");
      assert.strictEqual(logsChunk.filterParams.fromBlock, 500);
      assert.strictEqual(logsChunk.filterParams.toBlock, 1000);
      assert.deepEqual(logsChunk.aux, {});
    }
  });
  test({
    description: "marketCreated on [400, 1000]",
    params: {
      label: "marketCreated",
      filterParams: {
        fromBlock: 400,
        toBlock: 1000
      },
      aux: null
    },
    getLogs: function (label, filterParams, aux, callback) {
      var params = {label: label, filterParams: filterParams, aux: aux};
      if (!callback) return params;
      callback(null, params);
    },
    assertions: function (logsChunk) {
      assert.strictEqual(logsChunk.label, "marketCreated");
      assert.include([500, 400], logsChunk.filterParams.fromBlock);
      assert.include([1000, 499], logsChunk.filterParams.toBlock);
      assert.deepEqual(logsChunk.aux, {});
    }
  });
  test({
    description: "marketCreated on [100, 100]",
    params: {
      label: "marketCreated",
      filterParams: {
        fromBlock: 100,
        toBlock: 100
      },
      aux: null
    },
    getLogs: function (label, filterParams, aux, callback) {
      var params = {label: label, filterParams: filterParams, aux: aux};
      if (!callback) return params;
      callback(null, params);
    },
    assertions: function (logsChunk) {
      assert.strictEqual(logsChunk.label, "marketCreated");
      assert.strictEqual(logsChunk.filterParams.fromBlock, 100);
      assert.strictEqual(logsChunk.filterParams.toBlock, 100);
      assert.deepEqual(logsChunk.aux, {});
    }
  });
  test({
    description: "marketCreated on [100, 99]",
    params: {
      label: "marketCreated",
      filterParams: {
        fromBlock: 100,
        toBlock: 99
      },
      aux: null
    },
    getLogs: function (label, filterParams, aux, callback) {
      var params = {label: label, filterParams: filterParams, aux: aux};
      if (!callback) return params;
      callback(null, params);
    },
    assertions: function (logsChunk) {
      assert.isFalse(true);
    }
  });
});
describe("logs.getLogs", function () {
  // 5 total tests
  var test = function (t) {
    it(t.description, function () {
      var processLogs = augur.processLogs;
      var getFilteredLogs = augur.getFilteredLogs;
      augur.processLogs = t.processLogs;
      augur.getFilteredLogs = t.getFilteredLogs;
      t.assertions(augur.getLogs(t.label, t.filterParams, t.aux, t.callback));
      augur.processLogs = processLogs;
      augur.getFilteredLogs = getFilteredLogs;
    });
  };

  test({
    description: 'should handle only a label with no params, aux, or callback',
    label: 'log_add_tx',
    filterParams: undefined,
    aux: undefined,
    callback: undefined,
    processLogs: function (label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function (label, filterParams) {
      // pass back the filterParams only to test what was sent to getFilteredLogs
      return filterParams;
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        label: 'log_add_tx',
        index: undefined,
        filteredLogs: {},
        extraField: undefined,
        mergedLogs: undefined
      });
    }
  });

  test({
    description: 'should handle a label with params. no aux or callback',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    aux: undefined,
    callback: undefined,
    processLogs: function (label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function (label, filterParams) {
      // pass back the filterParams only to test what was sent to getFilteredLogs
      return filterParams;
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        label: 'log_add_tx',
        index: undefined,
        filteredLogs: {
          toBlock: '0x0b2',
          fromBlock: '0x0b1'
        },
        extraField: undefined,
        mergedLogs: undefined
      });
    }
  });

  test({
    description: 'should handle a label with params and aux, no callback',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    aux: {index: '0x000abc123', mergedLogs: {}, extraField: {name: 'test', value: 'example'}},
    callback: undefined,
    processLogs: function (label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function (label, filterParams) {
      // pass back the filterParams only to test what was sent to getFilteredLogs
      return filterParams;
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        label: 'log_add_tx',
        index: '0x000abc123',
        filteredLogs: {
          toBlock: '0x0b2',
          fromBlock: '0x0b1'
        },
        extraField: { name: 'test', value: 'example'},
        mergedLogs: {}
      });
    }
  });

  test({
    description: 'should handle a label with params, aux, and callback where getFilteredLogs does not error',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    aux: {index: '0x000abc123', mergedLogs: {}, extraField: {name: 'test', value: 'example'}},
    callback: function (err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, {
        label: 'log_add_tx',
        index: '0x000abc123',
        filteredLogs: {
          toBlock: '0x0b2',
          fromBlock: '0x0b1'
        },
        extraField: { name: 'test', value: 'example'},
        mergedLogs: {}
      });
    },
    processLogs: function (label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function (label, filterParams, cb) {
      // simply pass back the filterParams to be asserted later
      cb(null, filterParams);
    },
    assertions: function (o) {
      // not used, see callback
    }
  });

  test({
    description: 'should handle a label with params, aux as the callback and undefined callback passed where getFilteredLogs does error',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    aux: function (err, logs) {
      assert.deepEqual(err, { error: 'uh-oh!' });
    },
    callback: undefined,
    processLogs: function (label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function (label, filterParams, cb) {
      // simply pass back the filterParams to be asserted later
      cb({ error: 'uh-oh!' });
    },
    assertions: function (o) {
      // not used, see callback
    }
  });
});
describe("logs.getAccountTrades", function () {
  // 4 (so far - not talled at top) tests total
  var getLogsCC = 0;
  var getParsedCompleteSetsLogsCC = 0;
  var getParsedCompleteSetsLogs = augur.getParsedCompleteSetsLogs;
  var getLogs = augur.getLogs;
  var finished;
  afterEach(function () {
    augur.getParsedCompleteSetsLogs = getParsedCompleteSetsLogs;
    augur.getLogs = getLogs
    getLogsCC = 0;
    getParsedCompleteSetsLogsCC = 0;
    finished = undefined;
  })
  var test = function (t) {
    it(t.description, function (done) {
      augur.getLogs = t.getLogs;
      finished = done;
      augur.getParsedCompleteSetsLogs = t.getParsedCompleteSetsLogs;

      augur.getAccountTrades(t.account, t.filterParams, t.callback);
    });
  };
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the first call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      getLogsCC++;
      assert.deepEqual(aux, {
          index: ["market", "outcome"],
          mergedLogs: {},
          extraField: {name: "maker", value: false}
      });
      assert.deepEqual(filterParams, { sender: '0x0' });
      callback({ error: 'Uh-Oh!' });
    },
    callback: function (err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.deepEqual(getLogsCC, 1);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 0);
      finished();
    }
  });
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the first call - filterParams passed as callback.',
    account: '0x0',
    filterParams: function (err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.deepEqual(getLogsCC, 1);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 0);
      finished();
    },
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      getLogsCC++;
      assert.deepEqual(aux, {
          index: ["market", "outcome"],
          mergedLogs: {},
          extraField: {name: "maker", value: false}
      });
      assert.deepEqual(filterParams, { sender: '0x0' });
      callback({ error: 'Uh-Oh!' });
    },
    callback: undefined
  });
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the second call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      switch(getLogsCC) {
      case 1:
        getLogsCC++;
        assert.deepEqual(filterParams, { owner: '0x0' });
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: true}
        });
        callback({ error: 'Uh-Oh!' });
        break;
      default:
        getLogsCC++;
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false}
        });
        assert.deepEqual(filterParams, { sender: '0x0' });
        // 2nd argument doesn't matter in this case. only merged will be updated however in this test I am just skipping to error checks
        callback(null, []);
        break;
      }
    },
    callback: function (err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.deepEqual(getLogsCC, 2);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 0);
      finished();
    }
  });
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the third call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      switch(getLogsCC) {
      case 2:
        getLogsCC++;
        assert.deepEqual(filterParams, { sender: '0x0' });
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false }
        });
        callback({ error: 'Uh-Oh!' });
        break;
      case 1:
        getLogsCC++;
        assert.deepEqual(filterParams, { owner: '0x0' });
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: true}
        });
        callback(null, []);
        break;
      default:
        getLogsCC++;
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false}
        });
        assert.deepEqual(filterParams, { sender: '0x0' });
        // 2nd argument doesn't matter in this case. only merged will be updated however in this test I am just skipping to error checks
        callback(null, []);
        break;
      }

    },
    callback: function (err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.deepEqual(getLogsCC, 3);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 0);
      finished();
    }
  });
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the fourth call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      switch(getLogsCC) {
      case 3:
        getLogsCC++;
        assert.deepEqual(filterParams, { owner: '0x0' });
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: true }
        });
        callback({ error: 'Uh-Oh!' });
        break;
      case 2:
        getLogsCC++;
        assert.deepEqual(filterParams, { sender: '0x0' });
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false }
        });
        callback(null, []);
        break;
      case 1:
        getLogsCC++;
        assert.deepEqual(filterParams, { owner: '0x0' });
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: true}
        });
        callback(null, []);
        break;
      default:
        getLogsCC++;
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false}
        });
        assert.deepEqual(filterParams, { sender: '0x0' });
        // 2nd argument doesn't matter in this case. only merged will be updated however in this test I am just skipping to error checks
        callback(null, []);
        break;
      }

    },
    callback: function (err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.deepEqual(getLogsCC, 4);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 0);
      finished();
    }
  });
  test({
    description: 'Should handle filter params with noCompleteSets passed.',
    account: '0x0',
    filterParams: { noCompleteSets: true },
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      getLogsCC++;
      assert.isTrue(filterParams.noCompleteSets);
      if (filterParams.owner) {
        assert.deepEqual(filterParams.owner, '0x0');
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: true }
        });
      } else {
        assert.deepEqual(filterParams.sender, '0x0');
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false }
        });
      }
      callback(null);
    },
    callback: function (err, trades) {
      // this functions as our assertion function
      assert.deepEqual(trades, {});
      assert.isNull(err);
      assert.deepEqual(getLogsCC, 4);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 0);
      finished();
    }
  });
  test({
    description: 'Should handle logs including complete sets, error returned from getParsedCompleteSetsLogs.',
    account: '0x0',
    filterParams: {},
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      getLogsCC++;
      if (filterParams.owner) {
        assert.deepEqual(filterParams.owner, '0x0');
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: true }
        });
      } else {
        assert.deepEqual(filterParams.sender, '0x0');
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false }
        });
      }
      callback(null);
    },
    getParsedCompleteSetsLogs: function (account, filterParams, cb) {
      getParsedCompleteSetsLogsCC++;
      assert.deepEqual(account, '0x0');
      assert.deepEqual(filterParams, { shortAsk: false, mergeInto: {} });
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    callback: function (err, trades) {
      // this functions as our assertion function
      assert.deepEqual(trades, {});
      assert.isNull(err);
      assert.deepEqual(getLogsCC, 4);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 1);
      finished();
    }
  });
  test({
    description: 'Should handle logs including complete sets.',
    account: '0x0',
    filterParams: {},
    getLogs: function (label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      getLogsCC++;
      if (filterParams.owner) {
        assert.deepEqual(filterParams.owner, '0x0');
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: true }
        });
      } else {
        assert.deepEqual(filterParams.sender, '0x0');
        assert.deepEqual(aux, {
            index: ["market", "outcome"],
            mergedLogs: {},
            extraField: {name: "maker", value: false }
        });
      }
      callback(null);
    },
    getParsedCompleteSetsLogs: function (account, filterParams, cb) {
      getParsedCompleteSetsLogsCC++;
      assert.deepEqual(account, '0x0');
      assert.deepEqual(filterParams, { shortAsk: false, mergeInto: {} });
      cb(null, {});
    },
    callback: function (err, trades) {
      // this functions as our assertion function
      assert.deepEqual(trades, {});
      assert.isNull(err);
      assert.deepEqual(getLogsCC, 4);
      assert.deepEqual(getParsedCompleteSetsLogsCC, 1);
      finished();
    }
  });
});
describe("logs.sortTradesByBlockNumber", function () {
  // 2 total tests
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.sortTradesByBlockNumber(t.trades));
    });
  };

  test({
    description: 'Should handle a trades object with multiple markets trades',
    trades: {
      '0x0a1': {
        '1': [{blockNumber: '0x01'}, { blockNumber: '0x05' }, {blockNumber: '0x03'}],
        '2': [{ blockNumber: '0x04'}, { blockNumber: '0x08'}, { blockNumber: '0x02'}]
      },
      '0x0b1': {
        '1': [{blockNumber: '0x0f'}, {blockNumber: '0x0a'}, {blockNumber: '0x09'}, {blockNumber: '0x0c'}],
        '2': [{blockNumber: '0x0a'}, {blockNumber: '0x01'}, {blockNumber: '0x0d'}],
        '3': [{blockNumber: '0x05'}, {blockNumber: '0x011'}],
        '4': [{blockNumber: '0x012'}, {blockNumber: '0x0d'}, {blockNumber: '0x0d1'}, {blockNumber: '0x09c'}]
      }
    },
    assertions: function (o) {
      assert.deepEqual(o, {
        '0x0a1': {
          '1':
           [ { blockNumber: '0x01' },
           { blockNumber: '0x03' },
           { blockNumber: '0x05' } ],
          '2':
           [ { blockNumber: '0x02' },
           { blockNumber: '0x04' },
           { blockNumber: '0x08' } ]
        },
        '0x0b1': {
          '1':
           [ { blockNumber: '0x09' },
           { blockNumber: '0x0a' },
           { blockNumber: '0x0c' },
           { blockNumber: '0x0f' } ],
          '2':
           [ { blockNumber: '0x01' },
           { blockNumber: '0x0a' },
           { blockNumber: '0x0d' } ],
          '3': [ { blockNumber: '0x05' }, { blockNumber: '0x011' } ],
          '4':
          [ { blockNumber: '0x0d' },
           { blockNumber: '0x012' },
           { blockNumber: '0x09c' },
           { blockNumber: '0x0d1' } ]
        }
      })
    }
  });

  test({
    description: 'Should handle an empty trades object',
    trades: {},
    assertions: function (o) {
      assert.deepEqual(o, {});
    }
  });
});

/********************************
 * Raw log getters (deprecated) *
 ********************************/
describe("logs.getShortSellLogs", function () {
   // 6 tests total
   var test = function (t) {
     it(t.description, function () {
       var getLogs = augur.rpc.getLogs;
       augur.rpc.getLogs = t.getLogs;

       t.assertions(augur.getShortSellLogs(t.account, t.options, t.callback));

       augur.rpc.getLogs = getLogs;
     });
   };

   test({
     description: 'Should handle an empty options object as well as no callback passed',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: {},
     callback: undefined,
     getLogs: function (filter) { return filter; },
     assertions: function (o) {
       assert.deepEqual(o, {
         fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
         toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null]
       });
     }
   });

   test({
     description: 'Should handle options object where maker is false no callback passed',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: false, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: undefined,
     getLogs: function (filter) { return filter; },
     assertions: function (o) {
       assert.deepEqual(o, {
         fromBlock: '0x0b1',
         toBlock: '0x0c1',
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, '0x00000000000000000000000000000000000000000000000000000000000000a1', '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null]
       });
     }
   });

   test({
     description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs without an error',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: function (err, logs) {
       assert.isNull(err);
       assert.deepEqual(logs[0], {
         fromBlock: '0x0b1',
         toBlock: '0x0c1',
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, '0x00000000000000000000000000000000000000000000000000000000000000a1', null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12']
       });
     },
     getLogs: function (filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb([filter]);
     },
     assertions: function (o) {
       // assertions for this test are fround in the callback function above.
     }
   });

   test({
     description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs with an error',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: function (err, logs) {
       assert.deepEqual(err, {
         error: 'this is an error message.'
       });
       assert.isNull(logs);
     },
     getLogs: function (filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb({ error: 'this is an error message.' });
     },
     assertions: function (o) {
       // assertions for this test are fround in the callback function above.
     }
   });

   test({
     description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs as undefined',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: function (err, logs) {
       assert.isNull(err)
       assert.deepEqual(logs, []);
     },
     getLogs: function (filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb(undefined);
     },
     assertions: function (o) {
       // assertions for this test are fround in the callback function above.
     }
   });

   test({
     description: 'Should handle a callback passed in the options slot and getLogs returns logs without an error',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: function (err, logs) {
       assert.isNull(err);
       assert.deepEqual(logs[0], {
         fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
         toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null]
       });
     },
     callback: undefined,
     getLogs: function (filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb([filter]);
     },
     assertions: function (o) {
       // assertions for this test are fround in the callback function above.
     }
   });
 });
describe("logs.getTakerShortSellLogs", function () {
  // 3 tests total
  var test = function (t) {
    it(t.description, function () {
      var getShortSellLogs = augur.getShortSellLogs;
      augur.getShortSellLogs = t.getShortSellLogs;
      t.assertions(augur.getTakerShortSellLogs(t.account, t.options, t.callback));
      augur.getShortSellLogs = getShortSellLogs;
    });
  };

  test({
    description: 'Should handle something just an account, no options passed with a cb',
    account: '0x0',
    options: undefined,
    callback: noop,
    getShortSellLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: {maker: false}, callback: noop });
    }
  });

  test({
    description: 'Should handle something an account and some options passed with a cb',
    account: '0x0',
    options: { amount: '10' },
    callback: noop,
    getShortSellLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: {maker: false, amount: '10'}, callback: noop });
    }
  });

  test({
    description: 'Should handle something an account and cb is passed as the options',
    account: '0x0',
    options: noop,
    callback: undefined,
    getShortSellLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: {maker: false}, callback: noop });
    }
  });
});
describe("logs.getShortAskBuyCompleteSetsLogs", function () {
  // 3 tests total
  var test = function (t) {
    it(t.description, function () {
      var getCompleteSetsLogs = augur.getCompleteSetsLogs;
      augur.getCompleteSetsLogs = t.getCompleteSetsLogs;

      t.assertions(augur.getShortAskBuyCompleteSetsLogs(t.account, t.options, t.callback));

      augur.getCompleteSetsLogs = getCompleteSetsLogs;
    });
  };

  test({
    description: 'Should handle no options passed',
    account: '0x0',
    options: undefined,
    callback: noop,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: true, type: 'buy' }, callback: noop });
    }
  });

  test({
    description: 'Should handle options passed',
    account: '0x0',
    options: { market: '0x0c1' },
    callback: noop,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { market: '0x0c1', shortAsk: true, type: 'buy' }, callback: noop });
    }
  });

  test({
    description: 'Should handle options passed as the callback with no callback passed.',
    account: '0x0',
    options: noop,
    callback: undefined,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: true, type: 'buy' }, callback: noop });
    }
  });
});
describe("logs.getParsedCompleteSetsLogs", function () {
  // 4 tests total
  var test = function (t) {
    it(t.description, function () {
      var getCompleteSetsLogs = augur.getCompleteSetsLogs;
      var parseCompleteSetsLogs = augur.parseCompleteSetsLogs;
      augur.getCompleteSetsLogs = t.getCompleteSetsLogs;
      augur.parseCompleteSetsLogs = t.parseCompleteSetsLogs;

      augur.getParsedCompleteSetsLogs(t.account, t.options, t.callback);

      augur.getCompleteSetsLogs = getCompleteSetsLogs;
      augur.parseCompleteSetsLogs = parseCompleteSetsLogs;
    });
  };

  test({
    description: 'Should handle no options passed and no error from getCompleteSetsLogs',
    account: '0x0',
    options: undefined,
    callback: function (err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
    },
    getCompleteSetsLogs: function (account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, {});
      assert.isFunction(callback);
      callback(null, [{
        data: [ abi.bignum('100'), '2' ],
        topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
        blockNumber: '010101'
      }]);
    },
    parseCompleteSetsLogs: function (logs, mergeInto) {
      assert.isUndefined(mergeInto);
      return [{
        [logs[0].topics[2]]: [{
          amount: logs[0].data[0].toFixed(),
          blockNumber: parseInt(logs[0].blockNumber, 16),
          numOutcomes: logs[0].data[1],
          type: 'buy'
        }]
      }];
    }
  });

  test({
    description: 'Should handle no options passed and an error from getCompleteSetsLogs',
    account: '0x0',
    options: undefined,
    callback: function (err, logs) {
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.isUndefined(logs);
    },
    getCompleteSetsLogs: function (account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, {});
      assert.isFunction(callback);
      callback({ error: 'Uh-Oh!' });
    },
    parseCompleteSetsLogs: function (logs, mergeInto) {
      // Shouldn't be hit.
    }
  });

  test({
    description: 'Should handle options passed and no error from getCompleteSetsLogs',
    account: '0x0',
    options: { mergeInto: {} },
    callback: function (err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
    },
    getCompleteSetsLogs: function (account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, { mergeInto: {} });
      assert.isFunction(callback);
      callback(null, [{
        data: [ abi.bignum('100'), '2' ],
        topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
        blockNumber: '010101'
      }]);
    },
    parseCompleteSetsLogs: function (logs, mergeInto) {
      assert.deepEqual(mergeInto, {});
      return [{
        [logs[0].topics[2]]: [{
          amount: logs[0].data[0].toFixed(),
          blockNumber: parseInt(logs[0].blockNumber, 16),
          numOutcomes: logs[0].data[1],
          type: 'buy'
        }]
      }];
    }
  });

  test({
    description: 'Should handle options passed as the callback and no error from getCompleteSetsLogs',
    account: '0x0',
    options: function (err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
    },
    callback: undefined,
    getCompleteSetsLogs: function (account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, {});
      assert.isFunction(callback);
      callback(null, [{
        data: [ abi.bignum('100'), '2' ],
        topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
        blockNumber: '010101'
      }]);
    },
    parseCompleteSetsLogs: function (logs, mergeInto) {
      assert.isUndefined(mergeInto);
      return [{
        [logs[0].topics[2]]: [{
          amount: logs[0].data[0].toFixed(),
          blockNumber: parseInt(logs[0].blockNumber, 16),
          numOutcomes: logs[0].data[1],
          type: 'buy'
        }]
      }];
    }
  });
});
describe("logs.getCompleteSetsLogs", function () {
  var getLogs = augur.rpc.getLogs;
  var finished;
  afterEach(function () {
    augur.rpc.getLogs = getLogs;
    finished = null;
  });
  var test = function (t) {
    it(JSON.stringify(t) + ' sync', function (done) {
      finished = done;
      augur.rpc.getLogs = t.getLogs;
      // assume callback is the assertions function
      var assertions = t.callback;
      var options = t.options;
      if (isFunction(t.options)) {
        // if option is a function, then it's the callback, use that for assertions. options becomes undefined so we can test synchronously.
        assertions = t.options;
        options = undefined;
      }
      assertions(augur.getCompleteSetsLogs(t.account, options));
    });
    it(JSON.stringify(t) + ' async', function (done) {
      finished = done;
      augur.rpc.getLogs = t.getLogs;

      augur.getCompleteSetsLogs(t.account, t.options, t.callback);
    });
  };
  test({
    account: '0xdeadbeef123',
    options: function (err, logs) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    callback: undefined,
    getLogs: function (filter, cb) {
      assert.deepEqual(filter, {
      	fromBlock: '0x1',
      	toBlock: 'latest',
      	address: augur.store.getState().contractAddresses.CompleteSets,
      	topics: [
          augur.store.getState().contractsAPI.events.completeSets_logReturn.signature,
      		'0x00000000000000000000000000000000000000000000000000000deadbeef123',
      		null,
      		null
      	]
      });
      if(isFunction(cb)) {
        return cb({ error: 999, message: 'Uh-Oh!' });
      }
      return {error: 999, message: 'Uh-Oh!' };
    }
  });
  test({
    account: '0xdeadbeef123',
    options: { shortAsk: true, toBlock: '0xb2', fromBlock: '0xb1', market: '0xa1' },
    callback: function (err, logs) {
      // if logs is not undefined then this must be from async, otherwise sync.
      if (logs) {
        // async
        assert.deepEqual(logs, []);
        assert.isNull(err);
      } else {
        // sync
        assert.deepEqual(err, []);
        assert.isUndefined(logs);
      }
      finished();
    },
    getLogs: function (filter, cb) {
      assert.deepEqual(filter, {
      	fromBlock: '0xb1',
      	toBlock: '0xb2',
      	address: augur.store.getState().contractAddresses.BuyAndSellShares,
      	topics: [
          augur.store.getState().contractsAPI.events.completeSets_logReturn.signature,
      		'0x00000000000000000000000000000000000000000000000000000deadbeef123',
      		'0x00000000000000000000000000000000000000000000000000000000000000a1',
      		null
      	]
      });
      if(isFunction(cb)) {
        return cb([]);
      }
      return [];
    }
  });
  test({
    account: '0xdeadbeef123',
    options: { shortAsk: false, toBlock: '0xb2', fromBlock: '0xb1', market: '0xa1', type: 'buy' },
    callback: function (err, logs) {
      // if logs is not undefined then this must be from async, otherwise sync.
      if (logs) {
        // async
        assert.deepEqual(logs, [{
          data: [],
          topics: [],
          blockNumber: '0xb2'
        }, {
          data: [],
          topics: [],
          blockNumber: '0xb2'
        }]);
        assert.isNull(err);
      } else {
        // sync
        assert.deepEqual(err, [{
          data: [],
          topics: [],
          blockNumber: '0xb2'
        }, {
          data: [],
          topics: [],
          blockNumber: '0xb2'
        }]);
        assert.isUndefined(logs);
      }
      finished();
    },
    getLogs: function (filter, cb) {
      assert.deepEqual(filter, {
      	fromBlock: '0xb1',
      	toBlock: '0xb2',
      	address: augur.store.getState().contractAddresses.CompleteSets,
      	topics: [
          augur.store.getState().contractsAPI.events.completeSets_logReturn.signature,
      		'0x00000000000000000000000000000000000000000000000000000deadbeef123',
      		'0x00000000000000000000000000000000000000000000000000000000000000a1',
      		'0x0000000000000000000000000000000000000000000000000000000000000001'
      	]
      });
      if(isFunction(cb)) {
        return cb([{
          data: [],
          topics: [],
          blockNumber: '0xb2'
        }, {
          data: [],
          topics: [],
          blockNumber: '0xb2'
        }]);
      }
      return [{
        data: [],
        topics: [],
        blockNumber: '0xb2'
      }, {
        data: [],
        topics: [],
        blockNumber: '0xb2'
      }];
    }
  });
});
describe("logs.getBuyCompleteSetsLogs", function () {
  // 3 tests total
  var test = function (t) {
    it(t.description, function () {
      var getCompleteSetsLogs = augur.getCompleteSetsLogs;
      augur.getCompleteSetsLogs = t.getCompleteSetsLogs;
      t.assertions(augur.getBuyCompleteSetsLogs(t.account, t.options, t.callback));
      augur.getCompleteSetsLogs = getCompleteSetsLogs;
    });
  };

  test({
    description: 'Should handle no options passed',
    account: '0x0',
    options: undefined,
    callback: noop,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'buy' }, callback: noop });
    }
  });

  test({
    description: 'Should handle options passed',
    account: '0x0',
    options: { market: '0x0c1' },
    callback: noop,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { market: '0x0c1', shortAsk: false, type: 'buy' }, callback: noop });
    }
  });

  test({
    description: 'Should handle options passed as the callback with no callback passed.',
    account: '0x0',
    options: noop,
    callback: undefined,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'buy' }, callback: noop });
    }
  });
});
describe("logs.getSellCompleteSetsLogs", function () {
  // 3 tests total
  var test = function (t) {
    it(t.description, function () {
      var getCompleteSetsLogs = augur.getCompleteSetsLogs;
      augur.getCompleteSetsLogs = t.getCompleteSetsLogs;

      t.assertions(augur.getSellCompleteSetsLogs(t.account, t.options, t.callback));

      augur.getCompleteSetsLogs = getCompleteSetsLogs;
    });
  };

  test({
    description: 'Should handle no options passed',
    account: '0x0',
    options: undefined,
    callback: noop,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'sell' }, callback: noop });
    }
  });

  test({
    description: 'Should handle options passed',
    account: '0x0',
    options: { market: '0x0c1' },
    callback: noop,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { market: '0x0c1', shortAsk: false, type: 'sell' }, callback: noop });
    }
  });

  test({
    description: 'Should handle options passed as the callback with no callback passed.',
    account: '0x0',
    options: noop,
    callback: undefined,
    getCompleteSetsLogs: function (account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function (o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'sell' }, callback: noop });
    }
  });
});
