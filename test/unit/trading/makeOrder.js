"use strict";

var assert = require("chai").assert;
var augur = new (require("../../../src"))();

describe("makeOrder.placeBid", function () {
  // 2 tests total
  var buy = augur.buy;
  afterEach(function () {
    augur.buy = buy;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.buy = t.assertions;
      augur.placeBid(t.market, t.outcomeID, t.numShares, t.limitPrice, t.tradeGroupID, t.callback);
    });
  };
  test({
    description: 'Should prepare a binary market bid',
    market: { id: '0xa1', type: 'binary', minValue: 0},
    outcomeID: '1',
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    callback: function (out) {
      assert.isNull(out);
    },
    assertions: function (order) {
      assert.deepEqual(order.amount, '100');
      assert.deepEqual(order.price, '0.5');
      assert.deepEqual(order.market, '0xa1');
      assert.deepEqual(order.outcome, '1');
      assert.deepEqual(order.tradeGroupID, '0xab12');
      assert.deepEqual(order.scalarMinMax, {});
      assert.isFunction(order.onSent);
      assert.isFunction(order.onSuccess);
      order.onSuccess();
      assert.isFunction(order.onFailed);
    }
  });
  test({
    description: 'Should prepare a scalar market bid',
    market: { id: '0xa1', type: 'scalar', minValue: '-15'},
    outcomeID: '1',
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    assertions: function (order) {
      assert.deepEqual(order.amount, '100');
      assert.deepEqual(order.price, '0.5');
      assert.deepEqual(order.market, '0xa1');
      assert.deepEqual(order.outcome, '1');
      assert.deepEqual(order.tradeGroupID, '0xab12');
      assert.deepEqual(order.scalarMinMax, { minValue: '-15'});
      assert.isFunction(order.onSent);
      assert.isFunction(order.onSuccess);
      assert.isFunction(order.onFailed);
    }
  });
});
describe("makeOrder.placeAsk", function () {
  // 2 tests total
  var sell = augur.sell;
  afterEach(function () {
    augur.sell = sell;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.sell = t.assertions;
      augur.placeAsk(t.market, t.outcomeID, t.numShares, t.limitPrice, t.tradeGroupID, t.callback);
    });
  };
  test({
    description: 'Should prepare a binary market ask',
    market: { id: '0xa1', type: 'binary', minValue: 0},
    outcomeID: '1',
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    callback: function (out) {
      assert.isNull(out);
    },
    assertions: function (order) {
      assert.deepEqual(order.amount, '100');
      assert.deepEqual(order.price, '0.5');
      assert.deepEqual(order.market, '0xa1');
      assert.deepEqual(order.outcome, '1');
      assert.deepEqual(order.tradeGroupID, '0xab12');
      assert.deepEqual(order.scalarMinMax, {});
      assert.isFunction(order.onSent);
      assert.isFunction(order.onSuccess);
      order.onSuccess();
      assert.isFunction(order.onFailed);
    }
  });
  test({
    description: 'Should prepare a scalar market ask',
    market: { id: '0xa1', type: 'scalar', minValue: '-15'},
    outcomeID: '1',
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    assertions: function (order) {
      assert.deepEqual(order.amount, '100');
      assert.deepEqual(order.price, '0.5');
      assert.deepEqual(order.market, '0xa1');
      assert.deepEqual(order.outcome, '1');
      assert.deepEqual(order.tradeGroupID, '0xab12');
      assert.deepEqual(order.scalarMinMax, { minValue: '-15'});
      assert.isFunction(order.onSent);
      assert.isFunction(order.onSuccess);
      assert.isFunction(order.onFailed);
    }
  });
});
describe("makeOrder.placeShortAsk", function () {
  // 2 tests total
  var shortAsk = augur.shortAsk;
  afterEach(function () {
    augur.shortAsk = shortAsk;
  });
  var test = function (t) {
    it(t.description, function () {
      augur.shortAsk = t.assertions;
      augur.placeShortAsk(t.market, t.outcomeID, t.numShares, t.limitPrice, t.tradeGroupID, t.callback);
    });
  };
  test({
    description: 'Should prepare a binary market shortAsk',
    market: { id: '0xa1', type: 'binary', minValue: 0},
    outcomeID: '1',
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    callback: function (out) {
      assert.isNull(out);
    },
    assertions: function (order) {
      assert.deepEqual(order.amount, '100');
      assert.deepEqual(order.price, '0.5');
      assert.deepEqual(order.market, '0xa1');
      assert.deepEqual(order.outcome, '1');
      assert.deepEqual(order.tradeGroupID, '0xab12');
      assert.deepEqual(order.scalarMinMax, {});
      assert.isFunction(order.onSent);
      assert.isFunction(order.onSuccess);
      order.onSuccess();
      assert.isFunction(order.onFailed);
    }
  });
  test({
    description: 'Should prepare a scalar market shortAsk',
    market: { id: '0xa1', type: 'scalar', minValue: '-15'},
    outcomeID: '1',
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    assertions: function (order) {
      assert.deepEqual(order.amount, '100');
      assert.deepEqual(order.price, '0.5');
      assert.deepEqual(order.market, '0xa1');
      assert.deepEqual(order.outcome, '1');
      assert.deepEqual(order.tradeGroupID, '0xab12');
      assert.deepEqual(order.scalarMinMax, { minValue: '-15'});
      assert.isFunction(order.onSent);
      assert.isFunction(order.onSuccess);
      assert.isFunction(order.onFailed);
    }
  });
});
describe("makeOrder.placeAskAndShortAsk", function () {
  // 3 tests total
  var shortAsk = augur.shortAsk;
  var sell = augur.sell;
  var finished;
  var shortAskOnSuccess;
  var askOnSuccess;
  afterEach(function () {
    augur.shortAsk = shortAsk;
    augur.sell = sell;
  });
  var test = function (t) {
    it(t.description, function (done) {
      augur.shortAsk = t.shortAsk;
      augur.sell = t.sell;
      finished = done;
      augur.placeAskAndShortAsk(t.market, t.outcomeID, t.askShares, t.shortAskShares, t.limitPrice, t.tradeGroupID, t.callback);
    });
  };
  test({
    description: 'Should handle a cb and calling both sell and shortAsk. if both are successful, should call cb.',
    market: { id:'0xa1', type: 'binary' },
    outcomeID: '1',
    askShares: '20',
    shortAskShares: '10',
    limitPrice: '0.45',
    tradeGroupID: '0xabc12345',
    callback: function (arg) {
      assert.isNull(arg);
      finished();
    },
    shortAsk: function (arg) {
      assert.deepEqual(arg.amount, '10');
      assert.deepEqual(arg.price, '0.45');
      assert.deepEqual(arg.market, '0xa1');
      assert.deepEqual(arg.outcome, '1');
      assert.deepEqual(arg.tradeGroupID, '0xabc12345');
      assert.deepEqual(arg.scalarMinMax, {});
      assert.isFunction(arg.onSent);
      assert.isFunction(arg.onSuccess);
      assert.isFunction(arg.onFailed);
      shortAskOnSuccess = arg.onSuccess;
      // call success from shortAsk before sell so we test the onSuccess case for sell.
      shortAskOnSuccess();
      askOnSuccess();
    },
    sell: function (arg) {
      assert.deepEqual(arg.amount, '20');
      assert.deepEqual(arg.price, '0.45');
      assert.deepEqual(arg.market, '0xa1');
      assert.deepEqual(arg.outcome, '1');
      assert.deepEqual(arg.tradeGroupID, '0xabc12345');
      assert.deepEqual(arg.scalarMinMax, {});
      assert.isFunction(arg.onSent);
      assert.isFunction(arg.onSuccess);
      askOnSuccess = arg.onSuccess;
      assert.isFunction(arg.onFailed);
    }
  });
  test({
    description: 'Should handle no cb passed, still successful',
    market: { id:'0xa1', type: 'binary' },
    outcomeID: '2',
    askShares: '10',
    shortAskShares: '5',
    limitPrice: '0.39',
    tradeGroupID: '0xabc54321',
    callback: undefined,
    shortAsk: function (arg) {
      assert.deepEqual(arg.amount, '5');
      assert.deepEqual(arg.price, '0.39');
      assert.deepEqual(arg.market, '0xa1');
      assert.deepEqual(arg.outcome, '2');
      assert.deepEqual(arg.tradeGroupID, '0xabc54321');
      assert.deepEqual(arg.scalarMinMax, {});
      assert.isFunction(arg.onSent);
      assert.isFunction(arg.onSuccess);
      assert.isFunction(arg.onFailed);
      arg.onSuccess();
      // in this case we are just going to call the sell.onSuccess then shortAsk.onSuccess, no need for vars from previous test.
      finished();
    },
    sell: function (arg) {
      assert.deepEqual(arg.amount, '10');
      assert.deepEqual(arg.price, '0.39');
      assert.deepEqual(arg.market, '0xa1');
      assert.deepEqual(arg.outcome, '2');
      assert.deepEqual(arg.tradeGroupID, '0xabc54321');
      assert.deepEqual(arg.scalarMinMax, {});
      assert.isFunction(arg.onSent);
      assert.isFunction(arg.onSuccess);
      assert.isFunction(arg.onFailed);
      arg.onSuccess();
    }
  });
  test({
    description: 'Should handle cb passed, sell and shortAsk both fail',
    market: { id:'0xa3', type: 'scalar', minValue: '-230' },
    outcomeID: '1',
    askShares: '120',
    shortAskShares: '34',
    limitPrice: '-20.05',
    tradeGroupID: '0x12345abc',
    callback: function (arg) {
      assert.deepEqual(arg, { error: 999, message: 'Uh-Oh!' });
    },
    shortAsk: function (arg) {
      assert.deepEqual(arg.amount, '34');
      assert.deepEqual(arg.price, '-20.05');
      assert.deepEqual(arg.market, '0xa3');
      assert.deepEqual(arg.outcome, '1');
      assert.deepEqual(arg.tradeGroupID, '0x12345abc');
      assert.deepEqual(arg.scalarMinMax, { minValue: '-230' });
      assert.isFunction(arg.onSent);
      assert.isFunction(arg.onSuccess);
      assert.isFunction(arg.onFailed);
      arg.onFailed({ error: 999, message: 'Uh-Oh!' });
      // in this case we are just going to call the sell.onFailed then shortAsk.onFailed, no need for vars from the first test.
      finished();
    },
    sell: function (arg) {
      assert.deepEqual(arg.amount, '120');
      assert.deepEqual(arg.price, '-20.05');
      assert.deepEqual(arg.market, '0xa3');
      assert.deepEqual(arg.outcome, '1');
      assert.deepEqual(arg.tradeGroupID, '0x12345abc');
      assert.deepEqual(arg.scalarMinMax, { minValue: '-230' });
      assert.isFunction(arg.onSent);
      assert.isFunction(arg.onSuccess);
      assert.isFunction(arg.onFailed);
      arg.onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
});
