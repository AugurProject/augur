"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");

describe("logs.parseCompleteSetsLogs", function() {
  // 6 tests total
  var test = function(t) {
    it(t.description, function() {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
describe("logs.getFirstLogBlockNumber", function() {
	// 3 tests total
	var test = function(t) {
		describe(t.description, function() {
			it("sync", function() {
				t.assertions(augur.getFirstLogBlockNumber(t.logs));
			});
			// not an async function so no async test
		});
	};
	test({
		description: 'should handle an undefined logs and pass back 1',
		logs: undefined,
		assertions: function(o) {
			assert.deepEqual(o, 1);
		}
	});
	test({
		description: 'should handle an empty logs array and pass back 1',
		logs: [],
		assertions: function(o) {
			assert.deepEqual(o, 1);
		}
	});
	test({
		description: 'should handle an logs array and pass back the blockNumber from logs first entry',
		logs: [{blockNumber: '101010'}, {blockNumber: '202020'}, {blockNumber: '3303030'}],
		assertions: function(o) {
			assert.deepEqual(o, '101010');
		}
	});
});
describe("logs.getMarketCreationBlock", function() {
	// 2 tests total
	var test = function(t) {
		describe(t.description, function() {
			var getLogs = augur.getLogs;
			afterEach(function() { augur.getLogs = getLogs; });
			it("sync", function() {
				augur.getLogs = t.getLogs;
				t.assertions(null, augur.getMarketCreationBlock(t.marketID, undefined));
			});
			it("async", function(done) {
				augur.getLogs = t.getLogs;
				augur.getMarketCreationBlock(t.marketID, function(err, block) {
					t.assertions(err, block);
					done();
				});
			});
		});
	};
	test({
		description: 'should handle getting logs and returning the marketCreationBlock',
		marketID: '0x0a1',
		getLogs: function(label, filterParams, aux, cb) {
			if (!cb && utils.is_function(aux)) {
        cb = aux;
        aux = null;
      }
      var logs = [{blockNumber: '101010', filterParams: filterParams }];
      if (!cb) return logs;
      cb(null, logs);
		},
		assertions: function(err, o) {
			assert.isNull(err);
			assert.deepEqual(o, '101010');
		}
	});
	test({
		description: 'should handle getting an empty array from getLogs',
		marketID: '0x0a1',
		getLogs: function(label, filterParams, aux, cb) {
			if (!cb && utils.is_function(aux)) {
        cb = aux;
        aux = null;
      }
      var logs = [];
      if (!cb) return logs;
      cb(null, logs);
		},
		assertions: function(err, o) {
			assert.isNull(err);
			assert.deepEqual(o, 1);
		}
	});
  test({
		description: 'should handle getting an error from getLogs',
		marketID: '0x0a1',
		getLogs: function(label, filterParams, aux, cb) {
			if (!cb && utils.is_function(aux)) {
        cb = aux;
        aux = null;
      }
      var logs = [];
      if (!cb) return { error: 999, message: 'Uh-Oh!' };
      cb({ error: 999, message: 'Uh-Oh!' });
		},
		assertions: function(err, o) {
      if (o === 1) {
        // sync we don't get the error.
        assert.isNull(err);
        assert.deepEqual(o, 1);
      } else {
        // async
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
        assert.isUndefined(o);
      }
		}
	});
});
describe("logs.getMarketPriceHistory", function() {
  // 3 tests total
  var test = function(t) {
    describe(t.description, function () {
      var getMarketCreationBlock = augur.getMarketCreationBlock;
      var getLogs = augur.getLogs;
      after(function () {
        augur.getMarketCreationblock = getMarketCreationBlock;
        augur.getLogs = getLogs;
      });
      it("sync", function () {
        augur.getMarketCreationBlock = function (marketID, callback) {
          if (!callback) return t.creationBlock;
          callback(null, t.creationBlock);
        };
        augur.getLogs = function (label, filterParams, aux, callback) {
          if (!callback && utils.is_function(filterParams)) {
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
        augur.getMarketCreationBlock = function (marketID, callback) {
          if (!callback) return t.creationBlock;
          callback(null, t.creationBlock);
        };
        augur.getLogs = function (label, filterParams, aux, callback) {
          if (!callback && utils.is_function(filterParams)) {
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
    callback: utils.noop,
    assertions: function (err, o) {
      assert.isNull(err);
      assert.deepEqual(o, { test: 'hello world', market: '0x00a1', fromBlock: '0x2' });
    }
  });

  test({
    description: 'Should pass the market as the params if options is undefined',
    market: '0x00a1',
    creationBlock: 1234,
    options: undefined,
    // getLogs: function (type, params, index, callback) {
    //   if (!callback) return params;
    //   callback(null, params);
    // },
    // getMarketCreationBlock: function (marketID, callback) {
    //   if (!callback) return t.creationBlock;
    //   callback(null, t.creationBlock);
    // },
    assertions: function (err, o) {
      assert.isNull(err);
      assert.deepEqual(o, { market: '0x00a1', fromBlock: 1234 });
    }
  });

  test({
    description: 'Should be able to be passed just market and cb and still handle the request',
    market: '0x00a1',
    creationBlock: 1234,
    // getLogs: function (type, params, index, callback) {
    //   if (!callback) return params;
    //   callback(null, params);
    // },
    // getMarketCreationBlock: function (marketID, callback) {
    //   if (!callback) return t.creationBlock;
    //   callback(null, t.creationBlock);
    // },
    assertions: function (err, o) {
      assert.isNull(err);
      assert.deepEqual(o, { market: '0x00a1', fromBlock: 1234 });
    }
  });
});
describe("logs.sortByBlockNumber", function() {
  // 4 tests total
  var test = function(t) {
    it(t.description, function() {
      t.assertions(augur.sortByBlockNumber(t.a, t.b));
    });
  };

  test({
    description: 'should sort 2 numbers sent as Strings',
    a: { blockNumber: '3' },
    b: { blockNumber: '2' },
    assertions: function(o) {
      assert.equal(o, '1');
    }
  });

  test({
    description: 'should sort 2 numbers sent as JS Numbers',
    a: { blockNumber: 50 },
    b: { blockNumber: 3 },
    assertions: function(o) {
      assert.equal(o, 47);
    }
  });

  test({
    description: 'should sort 2 numbers sent as Hex Strings',
    a: { blockNumber: '0x01' },
    b: { blockNumber: '0x05' },
    assertions: function(o) {
      assert.equal(o, -4);
    }
  });

  test({
    description: 'should sort 2 numbers sent as Big Numbers',
    a: { blockNumber: abi.bignum('25') },
    b: { blockNumber: abi.bignum('3') },
    assertions: function(o) {
      assert.equal(o, 22);
    }
  });
});
describe("logs.buildTopicsList", function() {
  // 3 tests total
  var test = function(t) {
    it(t.description, function() {
      t.assertions(augur.buildTopicsList(t.event, t.params));
    });
  };

  test({
    description: 'should handle an event with a single input',
    event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [{ name: 'amount', indexed: true }]},
    params: { amount: '50' },
    assertions: function(o) {
      assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6' , '0x0000000000000000000000000000000000000000000000000000000000000050']);
    }
  });

  test({
    description: 'should handle an event with a multiple inputs, some indexed some not',
    event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [{ name: 'amount', indexed: true }, { name: 'unindexed', indexed: false }, { name: 'shares', indexed: true } ]},
    params: { amount: '50', unindexed: 'this shouldnt be in the topics array out', shares: '10' },
    assertions: function(o) {
      assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6' , '0x0000000000000000000000000000000000000000000000000000000000000050',
      '0x0000000000000000000000000000000000000000000000000000000000000010']);
    }
  });

  test({
    description: 'should handle an event with no inputs',
    event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: []},
    params: {},
    assertions: function(o) {
      assert.deepEqual(o, [ '0x59193f204bd4754cff0e765b9ee9157305fb373586ec5d680b49e6341ef922a6']);
    }
  });
});
describe("logs.parametrizeFilter", function() {
  // 2 tests total
  var test = function(t) {
    it(t.description, function() {
      t.assertions(augur.parametrizeFilter(t.event, t.params));
    });
  };

  test({
    description: 'should return a prepared filter object',
    event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [ { name: 'amount', indexed: true }, { name: 'market', indexed: true }, { name: 'numOutcomes', indexed: true } ], contract: 'CompleteSets'},
    params: { amount: '50', market: '0x0a1', numOutcomes: '2' },
    assertions: function(o) {
      assert.deepEqual(o, {
        fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
        toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
        address: augur.contracts.CompleteSets,
        topics: [augur.api.events.completeSets_logReturn.signature, '0x0000000000000000000000000000000000000000000000000000000000000050', '0x00000000000000000000000000000000000000000000000000000000000000a1',
        '0x0000000000000000000000000000000000000000000000000000000000000002'],
        timeout: augur.constants.GET_LOGS_TIMEOUT,
      });
    }
  });

  test({
    description: 'should return a prepared filter object when given to/from blocks',
    event: { signature: augur.api.events.completeSets_logReturn.signature, inputs: [ { name: 'amount', indexed: true }, { name: 'market', indexed: true }, { name: 'numOutcomes', indexed: true } ], contract: 'CompleteSets'},
    params: { amount: '50', market: '0x0a1', numOutcomes: '2', toBlock: '0x0b2', fromBlock: '0x0b1' },
    assertions: function(o) {
      assert.deepEqual(o, {
        fromBlock: '0x0b1',
        toBlock: '0x0b2',
        address: augur.contracts.CompleteSets,
        topics: [augur.api.events.completeSets_logReturn.signature, '0x0000000000000000000000000000000000000000000000000000000000000050', '0x00000000000000000000000000000000000000000000000000000000000000a1',
        '0x0000000000000000000000000000000000000000000000000000000000000002'],
        timeout: augur.constants.GET_LOGS_TIMEOUT,
      });
    }
  });
});
describe("logs.insertIndexedLog", function() {
  // 5 tests total
  var processedLogs;
  var test = function(t) {
    it(t.description, function() {
      processedLogs = t.processedLogs;
      t.assertions(augur.insertIndexedLog(t.processedLogs, t.parsed, t.index, t.log));
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
describe("logs.processLogs", function() {
  // 6 total tests
  var test = function(t) {
    it(t.description, function() {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
    assertions: function(o) {
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
describe("logs.getFilteredLogs", function() {
  // 6 total tests
  var test = function(t) {
    it(t.description, function() {
      var getLogs = augur.rpc.getLogs;
      augur.rpc.getLogs = t.getLogs;

      t.assertions(augur.getFilteredLogs(t.label, t.filterParams, t.callback));

      augur.rpc.getLogs = getLogs;
    });
  };

  test({
    description: 'Should handle undefined filterParams and cb',
    label: 'log_add_tx',
    filterParams: undefined,
    callback: undefined,
    getLogs: function(filters) {
      // simply pass back filters to be tested by assertions
      return filters;
    },
    assertions: function(o) {
      assert.deepEqual(o, {
        fromBlock: '0x1',
        toBlock: 'latest',
        address: augur.api.events['log_add_tx'].address,
        topics: [augur.api.events['log_add_tx'].signature,
          null,
          null
        ],
        timeout: 480000
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
    callback: undefined,
    getLogs: function(filters) {
      // simply pass back filters to be tested by assertions
      return filters;
    },
    assertions: function(o) {
      assert.deepEqual(o, {
        fromBlock: '0x0b1',
        toBlock: '0x0b2',
        address: augur.api.events['log_add_tx'].address,
        topics: [augur.api.events['log_add_tx'].signature,
          null,
          null
        ],
        timeout: 480000
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
    callback: function(err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs[0], {
        fromBlock: '0x0b1',
        toBlock: '0x0b2',
        address: augur.api.events['log_add_tx'].address,
        topics: [augur.api.events['log_add_tx'].signature,
          null,
          null
        ],
        timeout: 480000
      });
    },
    getLogs: function(filters, cb) {
      // simply pass back filters to be tested by cb assertions
      cb([filters]);
    },
    assertions: function(o) {}
  });

  test({
    description: 'Should handle passed filterParams and cb when getLogs returns an error object',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    callback: function(err, logs) {
      assert.isNull(logs);
      assert.deepEqual(err, {
        error: 'this is a problem!'
      });
    },
    getLogs: function(filters, cb) {
      // simply pass back filters to be tested by cb assertions
      cb({ error: 'this is a problem!' });
    },
    assertions: function(o) {}
  });

  test({
    description: 'Should handle passed filterParams and cb when getLogs returns an empty array',
    label: 'log_add_tx',
    filterParams: {
      toBlock: '0x0b2',
      fromBlock: '0x0b1'
    },
    callback: function(err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, []);
    },
    getLogs: function(filters, cb) {
      // simply pass back an empty array to be tested by cb assertions
      cb([]);
    },
    assertions: function(o) {}
  });

  test({
    description: 'Should handle passed filterParams as a callback',
    label: 'log_add_tx',
    filterParams: function(err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, []);
    },
    callback: undefined,
    getLogs: function(filters, cb) {
      // simply pass back undefined to be tested by cb assertions
      cb(undefined);
    },
    assertions: function(o) {}
  });
});
describe("logs.getLogs", function() {
  // 5 total tests
  var test = function(t) {
    it(t.description, function() {
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
    processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function(label, filterParams) {
      // pass back the filterParams only to test what was sent to getFilteredLogs
      return filterParams;
    },
    assertions: function(o) {
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
    processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function(label, filterParams) {
      // pass back the filterParams only to test what was sent to getFilteredLogs
      return filterParams;
    },
    assertions: function(o) {
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
    processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function(label, filterParams) {
      // pass back the filterParams only to test what was sent to getFilteredLogs
      return filterParams;
    },
    assertions: function(o) {
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
    callback: function(err, logs) {
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
    processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function(label, filterParams, cb) {
      // simply pass back the filterParams to be asserted later
      cb(null, filterParams);
    },
    assertions: function(o) {
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
    aux: function(err, logs) {
      assert.deepEqual(err, { error: 'uh-oh!' });
    },
    callback: undefined,
    processLogs: function(label, index, filteredLogs, extraField, mergedLogs) {
      // pass the args as an object so that they can be tested by assertions
      return {label: label, index: index, filteredLogs: filteredLogs, extraField: extraField, mergedLogs: mergedLogs };
    },
    getFilteredLogs: function(label, filterParams, cb) {
      // simply pass back the filterParams to be asserted later
      cb({ error: 'uh-oh!' });
    },
    assertions: function(o) {
      // not used, see callback
    }
  });
});
describe("logs.getAccountTrades", function() {
  // 4 (so far - not talled at top) tests total
  var getLogsCC = 0;
  var test = function(t) {
    it(t.description, function() {
      var getLogs = augur.getLogs;
      augur.getLogs = t.getLogs;
      getLogsCC = 0;

      augur.getAccountTrades(t.account, t.filterParams, t.callback);

      augur.getLogs = getLogs;
    });
  };

  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the first call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function(label, filterParams, aux, callback) {
      // just confirming we get the expected Aux object:
      assert.deepEqual(aux, {
          index: ["market", "outcome"],
          mergedLogs: {},
          extraField: {name: "maker", value: false}
      });
      assert.deepEqual(filterParams, { sender: '0x0' });
      callback({ error: 'Uh-Oh!' });
    },
    callback: function(err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
    }
  });
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the second call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function(label, filterParams, aux, callback) {
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
    callback: function(err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
    }
  });
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the third call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function(label, filterParams, aux, callback) {
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
    callback: function(err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
    }
  });
  test({
    description: 'Should handle no filter params passed as well as an error from getLogs on the fourth call.',
    account: '0x0',
    filterParams: undefined,
    getLogs: function(label, filterParams, aux, callback) {
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
    callback: function(err, trades) {
      // this functions as our assertion function
      assert.isUndefined(trades);
      assert.deepEqual(err, { error: 'Uh-Oh!' });
    }
  });
});
describe("logs.sortTradesByBlockNumber", function() {
  // 2 total tests
  var test = function(t) {
    it(t.description, function() {
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
    assertions: function(o) {
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
    assertions: function(o) {
      assert.deepEqual(o, {});
    }
  });
});

/********************************
 * Raw log getters (deprecated) *
 ********************************/
describe("logs.getShortSellLogs", function() {
   // 6 tests total
   var test = function(t) {
     it(t.description, function() {
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
     getLogs: function(filter) { return filter; },
     assertions: function(o) {
       assert.deepEqual(o, {
         fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
         toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null],
         timeout: augur.constants.GET_LOGS_TIMEOUT
       });
     }
   });

   test({
     description: 'Should handle options object where maker is false no callback passed',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: false, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: undefined,
     getLogs: function(filter) { return filter; },
     assertions: function(o) {
       assert.deepEqual(o, {
         fromBlock: '0x0b1',
         toBlock: '0x0c1',
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, '0x00000000000000000000000000000000000000000000000000000000000000a1', '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null],
         timeout: augur.constants.GET_LOGS_TIMEOUT
       });
     }
   });

   test({
     description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs without an error',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: function(err, logs) {
       assert.isNull(err);
       assert.deepEqual(logs[0], {
         fromBlock: '0x0b1',
         toBlock: '0x0c1',
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, '0x00000000000000000000000000000000000000000000000000000000000000a1', null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12'],
         timeout: augur.constants.GET_LOGS_TIMEOUT
       });
     },
     getLogs: function(filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb([filter]);
     },
     assertions: function(o) {
       // assertions for this test are fround in the callback function above.
     }
   });

   test({
     description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs with an error',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: function(err, logs) {
       assert.deepEqual(err, {
         error: 'this is an error message.'
       });
       assert.isNull(logs);
     },
     getLogs: function(filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb({ error: 'this is an error message.' });
     },
     assertions: function(o) {
       // assertions for this test are fround in the callback function above.
     }
   });

   test({
     description: 'Should handle options object where maker is true there is a callback passed and getLogs returns logs as undefined',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: { maker: true, market: '0x0a1', fromBlock: '0x0b1', toBlock: '0x0c1' },
     callback: function(err, logs) {
       assert.isNull(err)
       assert.deepEqual(logs, []);
     },
     getLogs: function(filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb(undefined);
     },
     assertions: function(o) {
       // assertions for this test are fround in the callback function above.
     }
   });

   test({
     description: 'Should handle a callback passed in the options slot and getLogs returns logs without an error',
     account: '0x02a32d32ca2b37495839dd932c9e92fea10cba12',
     options: function(err, logs) {
       assert.isNull(err);
       assert.deepEqual(logs[0], {
         fromBlock: augur.constants.GET_LOGS_DEFAULT_FROM_BLOCK,
         toBlock: augur.constants.GET_LOGS_DEFAULT_TO_BLOCK,
         address: augur.contracts.Trade,
         topics: [augur.api.events.log_short_fill_tx.signature, null, '0x00000000000000000000000002a32d32ca2b37495839dd932c9e92fea10cba12', null],
         timeout: augur.constants.GET_LOGS_TIMEOUT
       });
     },
     callback: undefined,
     getLogs: function(filter, cb) {
       // going to simply return filters in an array to represent "logs" since the logs aren't important to this function.
       cb([filter]);
     },
     assertions: function(o) {
       // assertions for this test are fround in the callback function above.
     }
   });
 });
describe("logs.getTakerShortSellLogs", function() {
  // 3 tests total
  var test = function(t) {
    it(t.description, function() {
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
    callback: utils.noop,
    getShortSellLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: {maker: false}, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle something an account and some options passed with a cb',
    account: '0x0',
    options: { amount: '10' },
    callback: utils.noop,
    getShortSellLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: {maker: false, amount: '10'}, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle something an account and cb is passed as the options',
    account: '0x0',
    options: utils.noop,
    callback: undefined,
    getShortSellLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: {maker: false}, callback: utils.noop });
    }
  });
});
describe("logs.getShortAskBuyCompleteSetsLogs", function() {
  // 3 tests total
  var test = function(t) {
    it(t.description, function() {
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
    callback: utils.noop,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: true, type: 'buy' }, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle options passed',
    account: '0x0',
    options: { market: '0x0c1' },
    callback: utils.noop,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { market: '0x0c1', shortAsk: true, type: 'buy' }, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle options passed as the callback with no callback passed.',
    account: '0x0',
    options: utils.noop,
    callback: undefined,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: true, type: 'buy' }, callback: utils.noop });
    }
  });
});
describe("logs.getParsedCompleteSetsLogs", function() {
  // 4 tests total
  var test = function(t) {
    it(t.description, function() {
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
    callback: function(err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
    },
    getCompleteSetsLogs: function(account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, {});
      assert.isFunction(callback);
      callback(null, [{
        data: [ abi.bignum('100'), '2' ],
        topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
        blockNumber: '010101'
      }]);
    },
    parseCompleteSetsLogs: function(logs, mergeInto) {
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
    callback: function(err, logs) {
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.isUndefined(logs);
    },
    getCompleteSetsLogs: function(account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, {});
      assert.isFunction(callback);
      callback({ error: 'Uh-Oh!' });
    },
    parseCompleteSetsLogs: function(logs, mergeInto) {
      // Shouldn't be hit.
    }
  });

  test({
    description: 'Should handle options passed and no error from getCompleteSetsLogs',
    account: '0x0',
    options: { mergeInto: {} },
    callback: function(err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
    },
    getCompleteSetsLogs: function(account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, { mergeInto: {} });
      assert.isFunction(callback);
      callback(null, [{
        data: [ abi.bignum('100'), '2' ],
        topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
        blockNumber: '010101'
      }]);
    },
    parseCompleteSetsLogs: function(logs, mergeInto) {
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
    options: function(err, logs) {
      assert.isNull(err);
      assert.deepEqual(logs, [{ '0x00c1': [ { amount: '100', blockNumber: 65793, numOutcomes: '2', type: 'buy' } ] }]);
    },
    callback: undefined,
    getCompleteSetsLogs: function(account, options, callback) {
      assert.deepEqual(account, '0x0');
      assert.deepEqual(options, {});
      assert.isFunction(callback);
      callback(null, [{
        data: [ abi.bignum('100'), '2' ],
        topics: ['0x00a1', '0x00b1', '0x00c1', '1'],
        blockNumber: '010101'
      }]);
    },
    parseCompleteSetsLogs: function(logs, mergeInto) {
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
describe("logs.getCompleteSetsLogs", function() {
  var getLogs = augur.rpc.getLogs;
  var finished;
  afterEach(function() {
    augur.rpc.getLogs = getLogs;
    finished = null;
  });
  var test = function(t) {
    it(JSON.stringify(t) + ' sync', function(done) {
      finished = done;
      augur.rpc.getLogs = t.getLogs;
      // assume callback is the assertions function
      var assertions = t.callback;
      var options = t.options;
      if (utils.is_function(t.options)) {
        // if option is a function, then it's the callback, use that for assertions. options becomes undefined so we can test synchronously.
        assertions = t.options;
        options = undefined;
      }
      assertions(augur.getCompleteSetsLogs(t.account, options));
    });
    it(JSON.stringify(t) + ' async', function(done) {
      finished = done;
      augur.rpc.getLogs = t.getLogs;

      augur.getCompleteSetsLogs(t.account, t.options, t.callback);
    });
  };
  test({
    account: '0xdeadbeef123',
    options: function(err, logs) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      finished();
    },
    callback: undefined,
    getLogs: function(filter, cb) {
      assert.deepEqual(filter, {
      	fromBlock: '0x1',
      	toBlock: 'latest',
      	address: augur.contracts.CompleteSets,
      	topics: [
          augur.api.events.completeSets_logReturn.signature,
      		'0x00000000000000000000000000000000000000000000000000000deadbeef123',
      		null,
      		null
      	],
      	timeout: 480000
      });
      if(utils.is_function(cb)) {
        return cb({ error: 999, message: 'Uh-Oh!' });
      }
      return {error: 999, message: 'Uh-Oh!' };
    }
  });
  test({
    account: '0xdeadbeef123',
    options: { shortAsk: true, toBlock: '0xb2', fromBlock: '0xb1', market: '0xa1' },
    callback: function(err, logs) {
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
    getLogs: function(filter, cb) {
      assert.deepEqual(filter, {
      	fromBlock: '0xb1',
      	toBlock: '0xb2',
      	address: augur.contracts.BuyAndSellShares,
      	topics: [
          augur.api.events.completeSets_logReturn.signature,
      		'0x00000000000000000000000000000000000000000000000000000deadbeef123',
      		'0x00000000000000000000000000000000000000000000000000000000000000a1',
      		null
      	],
      	timeout: 480000
      });
      if(utils.is_function(cb)) {
        return cb([]);
      }
      return [];
    }
  });
  test({
    account: '0xdeadbeef123',
    options: { shortAsk: false, toBlock: '0xb2', fromBlock: '0xb1', market: '0xa1', type: 'buy' },
    callback: function(err, logs) {
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
    getLogs: function(filter, cb) {
      assert.deepEqual(filter, {
      	fromBlock: '0xb1',
      	toBlock: '0xb2',
      	address: augur.contracts.CompleteSets,
      	topics: [
          augur.api.events.completeSets_logReturn.signature,
      		'0x00000000000000000000000000000000000000000000000000000deadbeef123',
      		'0x00000000000000000000000000000000000000000000000000000000000000a1',
      		'0x0000000000000000000000000000000000000000000000000000000000000001'
      	],
      	timeout: 480000
      });
      if(utils.is_function(cb)) {
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
describe("logs.getBuyCompleteSetsLogs", function() {
  // 3 tests total
  var test = function(t) {
    it(t.description, function() {
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
    callback: utils.noop,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'buy' }, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle options passed',
    account: '0x0',
    options: { market: '0x0c1' },
    callback: utils.noop,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { market: '0x0c1', shortAsk: false, type: 'buy' }, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle options passed as the callback with no callback passed.',
    account: '0x0',
    options: utils.noop,
    callback: undefined,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'buy' }, callback: utils.noop });
    }
  });
});
describe("logs.getSellCompleteSetsLogs", function() {
  // 3 tests total
  var test = function(t) {
    it(t.description, function() {
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
    callback: utils.noop,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'sell' }, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle options passed',
    account: '0x0',
    options: { market: '0x0c1' },
    callback: utils.noop,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { market: '0x0c1', shortAsk: false, type: 'sell' }, callback: utils.noop });
    }
  });

  test({
    description: 'Should handle options passed as the callback with no callback passed.',
    account: '0x0',
    options: utils.noop,
    callback: undefined,
    getCompleteSetsLogs: function(account, options, callback) {
      return { account: account, options: options, callback: callback };
    },
    assertions: function(o) {
      assert.deepEqual(o, { account: '0x0', options: { shortAsk: false, type: 'sell' }, callback: utils.noop });
    }
  });
});
