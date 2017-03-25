"use strict";

var assert = require("chai").assert;
var augur = new (require("../../../src"))();
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var noop = require("../../../src/utilities").noop;

// 61 tests total
describe('augur.cancel tests', function() {
	// 7 tests total
  var transact = augur.transact;
  var receipt = augur.rpc.receipt;
  afterEach(function() {
    augur.transact = transact;
    augur.rpc.receipt = receipt;
  });
  var test = function (t) {
    it(t.description, function(done) {
      augur.transact = t.transact;
      augur.rpc.receipt = t.receipt;
      if (t.trade_id.constructor === Object) {
        augur.cancel({
          trade_id: t.trade_id.trade_id,
          onSent: t.trade_id.onSent,
          onSuccess: function(result) {
          	t.trade_id.onSuccess(result);
          	done();
          },
          onFailed: t.trade_id.onFailed
        });
      } else {
        augur.cancel(t.trade_id, t.onSent, function(result) {
            t.onSuccess(result);
            done();
          }, function(error) {
            t.onFailed(error);
            done();
          });
      }
    });
  };
  test({
    description: "should send a cancel trade transaction with multiple arguments no logs.",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.cancel.to);
      assert.deepEqual(tx.params, ["tradeID"]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
      onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'});
    },
    receipt: function(hash, cb) {
      assert.deepEqual(hash, '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb');
      cb({
      	blockHash: '0xecb1f8b3c4af631b317a2fee11c74c39eaf8e89977f43dcabbe6d628b12d2f7c',
      	blockNumber: '0x1ae7',
      	logs: [],
      	from: '0x1',
      	to: '0x2',
      	transactionHash: hash,
      	gasUsed: '0xfda5',
      	cumulativeGasUsed: '0xfda5'
      });
    },
    trade_id: "tradeID",
    onSent: noop,
    onSuccess: function(result) {
      assert.deepEqual(result, {
        callReturn: '1',
        hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'
      });
    },
    onFailed: noop
  });
  test({
    description: "should send a cancel trade transaction with multiple arguments, logs is populated.",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.cancel.to);
      assert.deepEqual(tx.params, ["tradeID"]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
      onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'});
    },
    receipt: function(hash, cb) {
      assert.deepEqual(hash, '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb');
      cb({
      	blockHash: '0xecb1f8b3c4af631b317a2fee11c74c39eaf8e89977f43dcabbe6d628b12d2f7c',
      	blockNumber: '0x1ae7',
      	logs: [{
          topics: [augur.api.events.log_cancel.signature],
          data: [abi.fix('1'), '0x0a1', '0xb1', '0x0', '0x0', abi.fix('10.05')]
        }],
      	from: '0x3',
      	to: '0x4',
      	transactionHash: hash,
      	gasUsed: '0xfda5',
      	cumulativeGasUsed: '0xfda5'
      });
    },
    trade_id: "tradeID",
    onSent: noop,
    onSuccess: function(result) {
      assert.deepEqual(result, {
      	callReturn: '1',
        hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb',
        cashRefund: '10.05'
      });
    },
    onFailed: noop
  });
  test({
    description: "should send a cancel trade transaction with single argument, logs is populated.",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.cancel.to);
      assert.deepEqual(tx.params, ["tradeID"]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
      onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb'});
    },
    receipt: function(hash, cb) {
      assert.deepEqual(hash, '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb');
      cb({
      	blockHash: '0xecb1f8b3c4af631b317a2fee11c74c39eaf8e89977f43dcabbe6d628b12d2f7c',
      	blockNumber: '0x1ae7',
      	logs: [
        {
          topics: [augur.api.events.log_cancel.signature],
          data: [abi.fix('1'), '0x0a1', '0xb1', '0x0', '0x0', abi.fix('21.22')]
        }],
      	from: '0x5',
      	to: '0x6',
      	transactionHash: hash,
      	gasUsed: '0xfda5',
      	cumulativeGasUsed: '0xfda5'
      });
    },
    trade_id: {
      trade_id: "tradeID",
      onSent: noop,
      onSuccess: function(result) {
        assert.deepEqual(result, {
          callReturn: '1',
          hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb',
          cashRefund: '21.22'
        });
      },
      onFailed: noop
    },
  });
  test({
    description: "should handle a onSuccess call from transact that does not return a result",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.cancel.to);
      assert.deepEqual(tx.params, ["tradeID"]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
      onSuccess();
    },
    receipt: function(hash, cb) {
      // doesn't get hit in this example.
      assert.isTrue(false, 'Shouldnt call receipt if onSuccess from transact doesnt return a result.')
    },
    trade_id: "tradeID",
    onSent: noop,
    onSuccess: function(result) {
      assert.isUndefined(result);
    },
    onFailed: noop
  });
  test({
    description: "should handle a onSuccess call from transact that does return a result but result is missing a callReturn",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.cancel.to);
      assert.deepEqual(tx.params, ["tradeID"]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
      onSuccess({ hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb' });
    },
    receipt: function(hash, cb) {
      // doesn't get hit in this example.
      assert.isTrue(false, 'Shouldnt call receipt if onSuccess from transact doesnt return a result.')
    },
    trade_id: "tradeID",
    onSent: noop,
    onSuccess: function(result) {
      assert.deepEqual(result, { hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb' });
    },
    onFailed: noop
  });
  test({
    description: "should handle an undefined receipt",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.cancel.to);
      assert.deepEqual(tx.params, ["tradeID"]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
      onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb' });
    },
    receipt: function(hash, cb) {
      assert.deepEqual(hash, '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb');
      cb();
    },
    trade_id: "tradeID",
    onSent: noop,
    onSuccess: function(result) {
      // doesn't get hit in this example.
      assert.isTrue(false, 'onSuccess should not get called if receipt is returned as undefined.');
    },
    onFailed: function(error) {
      assert.deepEqual(error, augur.errors.TRANSACTION_RECEIPT_NOT_FOUND);
    }
  });
  test({
    description: "should handle a receipt with an error key value adn return it to onFailed.",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.cancel.to);
      assert.deepEqual(tx.params, ["tradeID"]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
      onSuccess({ callReturn: '1', hash: '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb' });
    },
    receipt: function(hash, cb) {
      assert.deepEqual(hash, '0x3f7acee08aed19bd7754f28ad8792a94ddce3a3e916fc4c928f268a9ef2477eb');
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    trade_id: "tradeID",
    onSent: noop,
    onSuccess: function(result) {
      // doesn't get hit in this example.
      assert.isTrue(false, 'onSuccess should not get called if receipt is returned as undefined.');
    },
    onFailed: function(error) {
      assert.deepEqual(error, { error: 999, message: 'Uh-Oh!' });
    }
  });
});

describe('augur.buy tests', function() {
	// 18 tests total
  var transact = augur.transact;
  var shrinkScalarPrice = augur.shrinkScalarPrice;
  afterEach(function() {
    augur.transact = transact;
    augur.shrinkScalarPrice = shrinkScalarPrice;
  });
  var test = function (t) {
    it(t.description, function() {
      augur.transact = t.transact;
      augur.shrinkScalarPrice = t.shrinkScalarPrice;
      augur.buy(t.amount, t.price, t.market, t.outcome, t.tradeGroupID, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    description: "Should handle a binary market buy using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 0.5,
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market buy using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market buy using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
      assert.isFunction(onSent);
      assert.isFunction(onSuccess);
      assert.isFunction(onFailed);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(0.5),
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market buy using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null
  });
  test({
    description: "Should handle a binary market buy using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa3', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a binary market buy using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa3', outcome: '1', scalarMinMax: null }
  });
  test({
    description: "Should handle a scalar market buy using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 55,
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: -10, maxValue: 140 },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market buy using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "55",
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: '-10', maxValue: '140' },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market buy using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(55),
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market buy using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "55",
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
  });
  test({
    description: "Should handle a scalar market buy using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '55', market: '0xa2', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a scalar market buy using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '55', market: '0xa2', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
  });

  test({
    description: "Should handle a categorical market buy using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 0.5,
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market buy using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market buy using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(0.5),
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market buy using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null
  });
  test({
    description: "Should handle a categorical market buy using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa1', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a categorical market buy using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.buy.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa1', outcome: '1', scalarMinMax: null }
  });
});
describe('augur.sell tests', function() {
	// 18 tests total
  var transact = augur.transact;
  var shrinkScalarPrice = augur.shrinkScalarPrice;
  afterEach(function() {
    augur.transact = transact;
    augur.shrinkScalarPrice = shrinkScalarPrice;
  });
  var test = function (t) {
    it(t.description, function() {
      augur.transact = t.transact;
      augur.shrinkScalarPrice = t.shrinkScalarPrice;

      augur.sell(t.amount, t.price, t.market, t.outcome, t.tradeGroupID, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    description: "Should handle a binary market sell using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 0.5,
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market sell using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market sell using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(0.5),
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market sell using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null
  });
  test({
    description: "Should handle a binary market sell using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa3', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a binary market sell using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa3', outcome: '1', scalarMinMax: null }
  });
  test({
    description: "Should handle a scalar market sell using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 55,
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: -10, maxValue: 140 },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market sell using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "55",
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: '-10', maxValue: '140' },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market sell using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(55),
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market sell using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "55",
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
  });
  test({
    description: "Should handle a scalar market sell using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '55', market: '0xa2', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a scalar market sell using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '55', market: '0xa2', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
  });

  test({
    description: "Should handle a categorical market sell using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 0.5,
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market sell using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market sell using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(0.5),
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market sell using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null
  });
  test({
    description: "Should handle a categorical market sell using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa1', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a categorical market sell using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.sell.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0, 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa1', outcome: '1', scalarMinMax: null }
  });
});
describe('augur.shortAsk tests', function() {
	// 18 tests total
  augur.bindContractAPI();
  var transact = augur.transact;
  var shrinkScalarPrice = augur.shrinkScalarPrice;
  afterEach(function() {
    augur.transact = transact;
    augur.shrinkScalarPrice = shrinkScalarPrice;
  });
  var test = function (t) {
    it(t.description, function() {
      augur.transact = t.transact;
      augur.shrinkScalarPrice = t.shrinkScalarPrice;
      augur.shortAsk(t.amount, t.price, t.market, t.outcome, t.tradeGroupID, t.scalarMinMax, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    description: "Should handle a binary market shortAsk using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 0.5,
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market shortAsk using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market shortAsk using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(0.5),
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a binary market shortAsk using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa3",
    outcome: "1",
    scalarMinMax: null
  });
  test({
    description: "Should handle a binary market shortAsk using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa3', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a binary market shortAsk using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa3', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa3', outcome: '1', scalarMinMax: null }
  });

  test({
    description: "Should handle a scalar market shortAsk using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 55,
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: -10, maxValue: 140 },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market shortAsk using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "55",
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: '-10', maxValue: '140' },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market shortAsk using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(55),
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) },
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a scalar market shortAsk using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "55",
    market: "0xa2",
    outcome: "1",
    scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }
  });
  test({
    description: "Should handle a scalar market shortAsk using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '55', market: '0xa2', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) }, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a scalar market shortAsk using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x3860e639d80640000", '0xa2', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '55', market: '0xa2', outcome: '1', scalarMinMax: { minValue: abi.bignum(-10), maxValue: abi.bignum(140) } }
  });

  test({
    description: "Should handle a categorical market shortAsk using JS Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: 10,
    price: 0.5,
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market shortAsk using String inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market shortAsk using Big Number inputs",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: abi.bignum(10),
    price: abi.bignum(0.5),
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null,
    onSent: noop,
    onSuccess: noop,
    onFailed: noop
  });
  test({
    description: "Should handle a categorical market shortAsk using String inputs but missing function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: "10",
    price: "0.5",
    market: "0xa1",
    outcome: "1",
    scalarMinMax: null
  });
  test({
    description: "Should handle a categorical market shortAsk using String inputs in a single object argument",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa1', outcome: '1', scalarMinMax: null, onSent: noop, onSuccess: noop, onFailed: noop}
  });
  test({
    description: "Should handle a categorical market shortAsk using String inputs in a single object argument missing the function hooks",
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.to, augur.api.functions.BuyAndSellShares.shortAsk.to);
      assert.deepEqual(tx.params, ["0x8ac7230489e80000", "0x6f05b59d3b20000", '0xa1', '1', "0x2386f26fc10000", 0]);
    },
    shrinkScalarPrice: function(minValue, price) {
      assert.equal(price, 55);
      assert.equal(minValue, -10);
      if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
      if (price.constructor !== BigNumber) price = abi.bignum(price);
      return price.minus(minValue).toFixed();
    },
    amount: { amount: '10', price: '0.5', market: '0xa1', outcome: '1', scalarMinMax: null }
  });
});
