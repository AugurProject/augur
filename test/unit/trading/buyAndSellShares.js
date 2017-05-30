"use strict";

var assert = require("chai").assert;
var proxyquire = require('proxyquire');
var eventsAPI = require("augur-contracts").api.events
var augur = new (require("../../../src"))();
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var noop = require("../../../src/utils/noop");
var MINIMUM_TRADE_SIZE = require("../../../src/constants").MINIMUM_TRADE_SIZE;

// 14 tests total
describe('augur.cancel tests', function () {
	// 5 tests total
	var finished;
  var test = function (t) {
    it(t.description, function (done) {
			finished = done;

			var apiCancel = augur.api.BuyAndSellShares.cancel;
			var cancel = proxyquire('../../../src/trading/cancel', {
				'../rpc-interface': {
					getTransactionReceipt: t.receipt
				}
			});

			augur.api.BuyAndSellShares.cancel = t.cancel;

			cancel(t.params);

			augur.api.BuyAndSellShares.cancel = apiCancel;
    });
  };
  test({
    description: "should send a cancel trade transaction, a single log returned.",
		params: {
			trade_id: "tradeID",
	    onSent: noop,
	    onSuccess: function (result) {
	      assert.deepEqual(result, {
	        callReturn: '1',
					cashRefund: '10.05',
	        hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'
	      });
				finished();
	    },
	    onFailed: noop
		},
    cancel: function (p) {
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'});
    },
    receipt: function (hash, cb) {
      assert.deepEqual(hash, '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb');
      cb({
      	blockHash: '0xecb1f8b3c4af631b317a2fee11c74c39eaf8e89977f43dcabbe6d628b12d2f7c',
      	blockNumber: '0x1ae7',
      	logs: [{
					topics: [eventsAPI.log_cancel.signature],
					data: [abi.fix('1'), '0x0a1', '0xb1', '0x0', '0x0', abi.fix('10.05')]
				}],
      	from: '0x1',
      	to: '0x2',
      	transactionHash: hash,
      	gasUsed: '0xfda5',
      	cumulativeGasUsed: '0xfda5'
      });
    }
  });
  test({
    description: "should send a cancel trade transaction, more than one log returned.",
		params: {
			trade_id: "tradeID",
	    onSent: noop,
	    onSuccess: function (result) {
	      assert.deepEqual(result, {
	      	callReturn: '1',
	        hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb',
	        cashRefund: '15.3'
	      });
				finished();
	    },
	    onFailed: noop
		},
    cancel: function (p) {
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'});
    },
    receipt: function (hash, cb) {
      assert.deepEqual(hash, '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb');
      cb({
      	blockHash: '0xecb1f8b3c4af631b317a2fee11c74c39eaf8e89977f43dcabbe6d628b12d2f7c',
      	blockNumber: '0x1ae7',
      	logs: [{
          topics: [eventsAPI.log_add_tx.signature],
          data: [abi.fix('1'), '0x0a1', '0xb1', '0x0', '0x0', abi.fix('10.05')]
        }, {
          topics: [eventsAPI.log_cancel.signature],
          data: [abi.fix('1'), '0x0a1', '0xb1', '0x0', '0x0', abi.fix('15.3')]
        }],
      	from: '0x3',
      	to: '0x4',
      	transactionHash: hash,
      	gasUsed: '0xfda5',
      	cumulativeGasUsed: '0xfda5'
      });
    },
  });
	test({
    description: "should send a cancel trade transaction, error from cancel",
		params: {
			trade_id: "tradeID",
	    onSent: noop,
	    onSuccess: function (result) {
	      assert.deepEqual(result, {
	        error: 999, message: 'Uh-Oh!'
	      });
				finished();
	    },
	    onFailed: noop
		},
    cancel: function (p) {
      assert.isFunction(p.onSuccess);
      p.onSuccess({ error: 999, message: 'Uh-Oh!' });
    },
    receipt: function (hash, cb) {}
  });
	test({
    description: "should send a cancel trade transaction, nothing returned from getTransactionReceipt",
		params: {
			trade_id: "tradeID",
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: function (err) {
				assert.deepEqual(err, augur.rpc.errors.TRANSACTION_RECEIPT_NOT_FOUND);
				finished();
			}
		},
    cancel: function (p) {
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'});
    },
    receipt: function (hash, cb) {
			cb();
		}
  });
	test({
    description: "should send a cancel trade transaction, error returned from getTransactionReceipt",
		params: {
			trade_id: "tradeID",
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: function (err) {
				assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
				finished();
			}
		},
    cancel: function (p) {
      assert.isFunction(p.onSuccess);
      p.onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'});
    },
    receipt: function (hash, cb) {
			cb({ error: 999, message: 'Uh-Oh!' });
		}
  });
});

describe('augur.buy tests', function () {
	// 3 tests total
	var finished;
  var test = function (t) {
    it(t.description, function (done) {
			finished = done;
			var apiBuy = augur.api.BuyAndSellShares.buy;
      augur.api.BuyAndSellShares.buy = t.buy;
      augur.trading.makeOrder.buy(t.params);
			augur.api.BuyAndSellShares.buy = apiBuy;
    });
  };
  test({
    description: "Should handle a binary market buy",
    buy: function (p) {
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(10, 'hex'),
				price: abi.fix(0.5, 'hex'),
				market: '0xa3',
				outcome: '1',
				scalarMinMax: null,
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
				tradeGroupID: 0
			}));
			finished();
    },
		params: {
			amount: 10,
	    price: 0.5,
	    market: "0xa3",
	    outcome: "1",
	    scalarMinMax: null,
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		}
  });
  test({
    description: "Should handle a scalar market buy",
    buy: function (p) {
			// price is 55 + 10 because 55 - -10 *minScalarValue* = 65
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(10, 'hex'),
				price: abi.fix((55 + 10), 'hex'),
				market: '0xa2',
				outcome: '1',
				scalarMinMax: { minValue: -10, maxValue: 140 },
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
				tradeGroupID: 0
			}));
			finished();
    },
		params: {
			amount: 10,
	    price: 55,
	    market: "0xa2",
	    outcome: "1",
	    scalarMinMax: { minValue: -10, maxValue: 140 },
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		}
  });
  test({
    description: "Should handle a categorical market buy",
		params: {
			amount: 320,
	    price: 0.85,
	    market: "0xa1",
	    outcome: "1",
	    scalarMinMax: null,
			tradeGroupID: '0x01',
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		},
    buy: function (p) {
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(320, 'hex'),
				price: abi.fix(0.85, 'hex'),
				market: '0xa1',
				outcome: '1',
				scalarMinMax: null,
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				tradeGroupID: '0x01',
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
			}));
			finished();
    },
  });
});
describe('augur.sell tests', function () {
	// 3 tests total
	var finished;
  var test = function (t) {
    it(t.description, function (done) {
			finished = done;
			var apiSell = augur.api.BuyAndSellShares.sell;
			augur.api.BuyAndSellShares.sell = t.sell;
			augur.trading.makeOrder.sell(t.params);
			augur.api.BuyAndSellShares.sell = apiSell;
    });
  };
  test({
    description: "Should handle a binary market sell",
		params: {
			amount: 10,
	    price: 0.5,
	    market: "0xa3",
	    outcome: "1",
	    scalarMinMax: null,
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		},
    sell: function (p) {
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(10, 'hex'),
				price: abi.fix(0.5, 'hex'),
				market: '0xa3',
				outcome: '1',
				scalarMinMax: null,
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
				isShortAsk: 0,
				tradeGroupID: 0
			}));
			finished();
    }
  });
  test({
    description: "Should handle a scalar market sell",
    sell: function (p) {
			// to get scalar price we need to take our price - minScalar (35 - -10)
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(23, 'hex'),
				price: abi.fix((35 + 10), 'hex'),
				market: '0xa2',
				outcome: '1',
				scalarMinMax: { minValue: -10, maxValue: 140 },
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				tradeGroupID: '0x01',
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
				isShortAsk: 0,
			}));
			finished();
    },
    params: {
			amount: 23,
	    price: 35,
	    market: "0xa2",
	    outcome: "1",
	    scalarMinMax: { minValue: -10, maxValue: 140 },
			tradeGroupID: '0x01',
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		}
  });

  test({
    description: "Should handle a categorical market sell",
		params: {
			amount: 120,
	    price: 0.35,
	    market: "0xa1",
	    outcome: "1",
	    scalarMinMax: null,
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		},
    sell: function (p) {
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(120, 'hex'),
				price: abi.fix(.35, 'hex'),
				market: '0xa1',
				outcome: '1',
				scalarMinMax: null,
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
				isShortAsk: 0,
				tradeGroupID: 0
			}));
			finished();
    }
  });
});
describe('augur.shortAsk tests', function () {
	// 3 tests total
  var finished;
  var test = function (t) {
    it(t.description, function (done) {
			finished = done;
			var apiShortAsk = augur.api.BuyAndSellShares.shortAsk;
			augur.api.BuyAndSellShares.shortAsk = t.shortAsk;
      augur.trading.makeOrder.shortAsk(t.params);
			augur.api.BuyAndSellShares.shortAsk = apiShortAsk;
    });
  };
  test({
    description: "Should handle a binary market shortAsk",
		params: {
			amount: 10,
	    price: 0.5,
	    market: "0xa3",
	    outcome: "1",
	    scalarMinMax: null,
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		},
    shortAsk: function (p) {
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(10, 'hex'),
				price: abi.fix(0.5, 'hex'),
				market: '0xa3',
				outcome: '1',
				scalarMinMax: null,
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
				tradeGroupID: 0
			}));
    	finished();
    },
  });
  test({
    description: "Should handle a scalar market shortAsk",
		params: {
			amount: 63,
	    price: 90,
	    market: "0xa2",
	    outcome: "1",
	    scalarMinMax: { minValue: -10, maxValue: 140 },
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		},
    shortAsk: function (p) {
			// scalar price is price - minScalarPrice (90 - -10) = 100
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(63, 'hex'),
				price: abi.fix((90 + 10), 'hex'),
				market: '0xa2',
				outcome: '1',
				scalarMinMax: { minValue: -10, maxValue: 140 },
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
				tradeGroupID: 0
			}));
			finished();
    }
  });
  test({
    description: "Should handle a categorical market shortAsk",
		params: {
			amount: 5,
	    price: 0.95,
	    market: "0xa1",
	    outcome: "1",
	    scalarMinMax: null,
			tradeGroupID: '0x01',
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: noop
		},
    shortAsk: function (p) {
			assert.deepEqual(JSON.stringify(p), JSON.stringify({
				amount: abi.fix(5, 'hex'),
				price: abi.fix(0.95, 'hex'),
				market: '0xa1',
				outcome: '1',
				scalarMinMax: null,
				tradeGroupID: '0x01',
				onSent: noop,
				onSuccess: noop,
				onFailed: noop,
				minimumTradeSize: abi.fix(MINIMUM_TRADE_SIZE, 'hex'),
			}));
			finished();
    }
  });
});
